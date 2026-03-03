
import sys, os
from app.config import DATA_CSV, MODEL_PATH, PREPROCESSOR_PATH, BASE_DIR
from app.models.supply_model import train_and_save
from pathlib import Path

def main():
    csv_path = DATA_CSV
    model_path = MODEL_PATH
    preproc_path = PREPROCESSOR_PATH
    model_dir = Path(model_path).parent
    model_dir.mkdir(parents=True, exist_ok=True)
    clf, preproc, num_cols, cat_cols = train_and_save(csv_path, model_path, preproc_path)
    print("Training complete. Model saved to:", model_path)
    return 0

if __name__ == "__main__":
    sys.exit(main())
