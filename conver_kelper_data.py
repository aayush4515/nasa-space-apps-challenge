'''
This API converts a raw dataset pulled from NASA's dataset
to a standard dataset to input to the Machine Learning model
'''

import os
import pandas as pd
import csv

# features to include
selected_features = [
    "kepoi_name",
    "koi_disposition",
    "koi_period",
    "koi_time0bk",
    "koi_duration",
    "koi_depth",
    "koi_max_sngle_ev",
    "koi_max_mult_ev",
    "koi_num_transits",
    "koi_steff",
    "koi_slogg",
    "koi_smet",
    "koi_srad",
    "koi_smass",
    "ra",
    "dec",
    "koi_kepmag"
]

# file path
file_path = "/Users/aayush/Desktop/Projects/nasa-space-apps-challenge/Assets/kepler.csv"
output_path = "clean_kepler_dataset.csv"

# Detect header row dynamically (first line that doesn't start with '#')
with open(file_path, 'r') as f:
    header_line = 0
    for i, line in enumerate(f):
        if not line.startswith('#'):
            header_line = i
            break

def clean__kepler_dataset(input_path, output_path):
    df = pd.read_csv(
    input_path,
    delimiter=',',        # 👈 force comma, don't use dialect
    on_bad_lines='skip',
    engine='python',
    quotechar='"',
    skiprows=header_line - 1,
    header=1
    )

    # Normalize columns
    df.columns = df.columns.str.strip().str.lower()
    print("Detected columns:", df.columns[:10].tolist())


    normalized_features = [f.lower().strip() for f in selected_features]
    available_features = [f for f in normalized_features if f in df.columns]
    missing_features = [f for f in normalized_features if f not in df.columns]

    clean_df = df[available_features]

    clean_df.to_csv(output_path, index=False)
    print(f"✅ Cleaned dataset saved to {output_path}")
    print(f"🟢 Kept {len(available_features)} features, skipped {len(missing_features)} missing ones")
    if missing_features:
        print(f"⚠️ Missing features: {missing_features}")


clean__kepler_dataset(file_path, output_path)