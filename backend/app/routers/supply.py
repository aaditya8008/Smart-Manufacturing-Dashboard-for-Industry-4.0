from fastapi import APIRouter, HTTPException, Body, Query
from app.config import MODEL_PATH, PREPROCESSOR_PATH, DATA_CSV, RETRAIN_SECRET
import joblib, pandas as pd, numpy as np
from datetime import datetime
from typing import Optional
import subprocess, sys, os

router = APIRouter()


_model = None
_preproc = None
_df = None
_feature_names = None


def load_artifacts():
    """Load model, preprocessor, and dataset only once."""
    global _model, _preproc, _df, _feature_names

    if _model is None or _preproc is None:
        try:
            _model = joblib.load(str(MODEL_PATH))
            _preproc = joblib.load(str(PREPROCESSOR_PATH))
        except Exception as e:
            raise RuntimeError(f"Model artifacts not found: {e}")

    if _df is None:
        try:
            _df = pd.read_csv(DATA_CSV, parse_dates=["timestamp"])
        except Exception as e:
            raise RuntimeError(f"Failed to read dataset: {e}")

    _feature_names = None
    return


@router.get("/supply/risk")
def supply_risk():
    """Get latest supply chain risk info and recent trends."""
    try:
        load_artifacts()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    df = _df.copy().sort_values("timestamp")
    last_row = df.iloc[-1:]
    X = last_row.drop(columns=["risk_label", "risk_probability", "timestamp"], errors="ignore")

    try:
        X_proc = _preproc.transform(X)
        probas = _model.predict_proba(X_proc)[0]
        classes = _model.classes_
        idx = int(np.argmax(probas))
        risk_label = classes[idx]
        risk_prob = float(probas[idx])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

    # Timeseries aggregation (daily average)
    if "risk_probability" in df.columns:
        ts = (
            df.set_index("timestamp")
            .resample("D")["risk_probability"]
            .mean()
            .fillna(0)
            .tail(90)
            .reset_index()
        )
        timeseries = [
            {
                "date": str(int(pd.Timestamp(row["timestamp"]).timestamp())),
                "avg_risk": float(row["risk_probability"]),
            }
            for _, row in ts.iterrows()
        ]
    else:
        timeseries = []

    # Feature importances
    fi = []
    if hasattr(_model, "feature_importances_"):
        importances = _model.feature_importances_
        numeric_cols = _preproc.transformers_[0][2]
        cat_cols = _preproc.transformers_[1][2]
        names = list(numeric_cols) + ["ohe_" + str(i) for i in range(len(importances) - len(numeric_cols))]
        fi = [
            {"feature": names[i] if i < len(names) else f"f{i}", "importance": float(importances[i])}
            for i in range(len(importances))
        ]
        fi = sorted(fi, key=lambda x: -x["importance"])[:12]

    return {
        "status": "ok",
        "timestamp": str(datetime.utcnow().isoformat()) + "Z",
        "risk_label": str(risk_label),
        "risk_probability": risk_prob,
        "timeseries": timeseries,
        "feature_importances": fi,
        "source": str(DATA_CSV),
    }


@router.post("/supply/predict")
def supply_predict(payload: dict = Body(...)):
    """Predict supply chain risk from user-provided JSON."""
    try:
        load_artifacts()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model not loaded: {e}")

    try:
        X = pd.DataFrame([payload])

        # Get expected feature columns from preprocessor
        num_cols = _preproc.transformers_[0][2]
        cat_cols = _preproc.transformers_[1][2]
        expected_cols = list(num_cols) + list(cat_cols)

        # Add missing columns with safe defaults
        for col in expected_cols:
            if col not in X.columns:
                X[col] = 0 if col in num_cols else "Unknown"

        # Drop extra columns
        X = X[expected_cols]

        # Transform + predict
        X_proc = _preproc.transform(X)
        pred = _model.predict(X_proc)[0]
        proba = _model.predict_proba(X_proc)[0]
        idx = int(np.argmax(proba))

        return {
            "status": "ok",
            "risk_label": str(pred),
            "risk_probability": float(proba[idx]),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")


@router.post("/supply/retrain")
def supply_retrain(secret: str = Query(...)):
    """Retrain the supply chain model (admin-only)."""
    if secret != RETRAIN_SECRET:
        raise HTTPException(status_code=403, detail="Forbidden")

    script = os.path.join(os.path.dirname(__file__), "..", "..", "scripts", "train_supply_model.py")
    res = subprocess.run([sys.executable, script], capture_output=True, text=True)

    if res.returncode != 0:
        raise HTTPException(status_code=500, detail=res.stderr)

    return {"status": "ok", "message": "retrained", "stdout": res.stdout}
