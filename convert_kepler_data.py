'''
This API converts a raw dataset pulled from NASA's dataset
to a standard dataset to input to the Machine Learning model
'''

import os
import pandas as pd
import csv

# features to include
selected_features = [
    "koi_period", "koi_time0bk", "koi_time0", "koi_impact", "koi_duration",
    "koi_depth",
    "koi_ror",
    "koi_srho",
    "koi_prad",
    "koi_sma",
    "koi_incl",
    "koi_teq",
    "koi_insol",
    "koi_dor",
    "koi_ldm_coeff2",
    "koi_ldm_coeff1",
    "koi_max_sngle_ev",
    "koi_max_mult_ev",
    "koi_model_snr",
    "koi_num_transits",
    "koi_bin_oedp_sig",
    "koi_steff",
    "koi_slogg",
    "koi_smet",
    "koi_srad",
    "koi_smass",
    "ra",
    "dec",
    "koi_kepmag",
    "koi_gmag",
    "koi_rmag",
    "koi_imag",
    "koi_zmag",
    "koi_jmag",
    "koi_hmag",
    "koi_kmag",
    "koi_fwm_stat_sig",
    "koi_fwm_sra",
    "koi_fwm_sdec",
    "koi_fwm_srao",
    "koi_fwm_sdeco",
    "koi_fwm_prao",
    "koi_fwm_pdeco",
    "koi_dicco_mra",
    "koi_dicco_mdec",
    "koi_dicco_msky",
    "koi_dikco_mra",
    "koi_dikco_mdec",
    "koi_dikco_msky",
    "koi_fittype_LS",
    "koi_fittype_MCMC"
]

# file path
file_path = "/Users/aayush/Desktop/Projects/nasa-space-apps-challenge/Assets/cumulative_2025.10.04_08.42.21.csv"
output_path = "cleaned_kepler_dataset.xlsx"

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