

from typing import Tuple
import numpy as np

try:
    from sklearn.ensemble import IsolationForest
except Exception:
    IsolationForest = None


class LiveAnomalyModel:
    """
    IsolationForest-based anomaly detector for multi-sensor IoT streams.
    Supports both batch and single predictions.
    """

    def __init__(self, contamination: float = 0.08, n_estimators: int = 200, random_state: int = 42):
        self.contamination = contamination
        self.n_estimators = n_estimators
        self.random_state = random_state
        self.model = None

    @property
    def is_fit(self) -> bool:
        """Check if the model has been trained."""
        return self.model is not None

    def fit(self, X: np.ndarray):
        """Train IsolationForest on a dataset."""
        if IsolationForest is None:
            raise ImportError("scikit-learn is required for IsolationForest model.")
        self.model = IsolationForest(
            contamination=self.contamination,
            n_estimators=self.n_estimators,
            random_state=self.random_state,
        )
        self.model.fit(X)

    def predict_one(self, x: np.ndarray) -> Tuple[int, float]:
        """Predict anomaly for a single sample."""
        if not self.is_fit:
            # Model not trained — assume normal
            return (1, 0.0)

        # predict returns -1 for anomaly, 1 for normal
        pred = int(self.model.predict([x])[0])

        # decision_function: higher = more normal; invert and map to [0,1]
        s = -float(self.model.decision_function([x])[0])
        score = 1.0 / (1.0 + np.exp(-3.0 * (s - 0.2)))  # smooth mapping
        return (pred, float(score))

    def predict_batch(self, X: np.ndarray):
        """Predict anomaly scores for multiple samples."""
        if not self.is_fit:
            # if model not fitted, return all normal
            return (np.ones(len(X), dtype=int), np.zeros(len(X), dtype=float))

        preds = self.model.predict(X)
        s = -self.model.decision_function(X)
        scores = 1.0 / (1.0 + np.exp(-3.0 * (s - 0.2)))
        return (preds.astype(int), scores.astype(float))