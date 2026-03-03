from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.base import BaseEstimator, TransformerMixin
import joblib
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import classification_report, accuracy_score

def build_preprocessor(df: pd.DataFrame):
    # infer numeric and categorical columns
    numeric_cols = df.select_dtypes(include=["int64","float64"]).columns.tolist()
    cat_cols = df.select_dtypes(include=["object","category"]).columns.tolist()
    # drop label if present
    for l in ("risk_label","risk_probability","timestamp"):
        if l in numeric_cols:
            numeric_cols.remove(l)
        if l in cat_cols:
            cat_cols.remove(l)
    # Simple numeric pipeline
    num_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])
    cat_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="constant", fill_value="__missing__")),
        ("ohe", OneHotEncoder(handle_unknown="ignore", sparse_output=False))

    ])
    preprocessor = ColumnTransformer([
        ("num", num_pipeline, numeric_cols),
        ("cat", cat_pipeline, cat_cols)
    ])
    return preprocessor, numeric_cols, cat_cols

def train_and_save(csv_path, model_path, preproc_path):
    df = pd.read_csv(csv_path, parse_dates=["timestamp"])
    # drop rows missing label
    df = df.dropna(subset=["risk_label"])
    # convert label to categories
    y = df["risk_label"].astype("category")
    X = df.drop(columns=["risk_label","risk_probability","timestamp"])
    preproc, num_cols, cat_cols = build_preprocessor(X)
    X_pre = preproc.fit_transform(X)
    # train-test split
    X_train, X_test, y_train, y_test = train_test_split(X_pre, y, test_size=0.2, random_state=42, stratify=y)
    clf = RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1)
    clf.fit(X_train, y_train)
    # evaluate
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print("Supply model accuracy:", acc)
    print(classification_report(y_test, y_pred))
    joblib.dump(clf, model_path)
    joblib.dump(preproc, preproc_path)
    return clf, preproc, num_cols, cat_cols
