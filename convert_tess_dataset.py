import os
import pandas as pd
import csv

# features to include
selected_features = [
    "ra",
    "dec",
    "st_pmra",
    "st_pmdec",
    "pl_tranmid",
    "pl_orbper",
    "pl_trandurh",
    "pl_trandep",
    "pl_rade",
    "pl_insol",
    "pl_eqt",
    "st_tmag",
    "st_dist",
    "st_teff",
    "st_logg",
    "st_rad"
]

# file path
file_path = "/Users/aayush/Desktop/Projects/nasa-space-apps-challenge/Assets/TOI_2025.10.04_12.05.38.csv"
output_path = "clean_tess_dataset.csv"

# Detect header row dynamically (first line that doesn't start with '#')
with open(file_path, 'r') as f:
    header_line = 0
    for i, line in enumerate(f):
        if not line.startswith('#'):
            header_line = i
            break

def clean__tess_dataset(input_path, output_path):
    df = pd.read_csv(
    input_path,
    delimiter=',',        # 👈 force comma, don't use dialect
    on_bad_lines='skip',
    engine='python',
    quotechar='"',
    skiprows=header_line - 1,
    header=1
    )

    # Filter rows where tfopwg_disp is either PC or APC
    if "tfopwg_disp" in df.columns:
        df = df[df["tfopwg_disp"].isin(["PC", "APC"])]
    else:
        print("⚠️ Column 'tfopwg_disp' not found in dataset!")

    normalized_features = [f.lower().strip() for f in selected_features]
    available_features = [f for f in normalized_features if f in df.columns]
    missing_features = [f for f in normalized_features if f not in df.columns]

    clean_df = df[available_features]

    clean_df.to_csv(output_path, index=False)
    print(f"✅ Cleaned dataset saved to {output_path}")
    print(f"🟢 Kept {len(available_features)} features, skipped {len(missing_features)} missing ones")
    if missing_features:
        print(f"⚠️ Missing features: {missing_features}")


clean__tess_dataset(file_path, output_path)