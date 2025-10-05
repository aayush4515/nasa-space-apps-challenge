/**
 * Direct prediction service - no API calls needed
 * Uses Python functions directly through a simple interface
 */

class PredictionService {
  constructor() {
    this.currentDataset = null;
    this.currentCandidate = null;
  }

  /**
   * Set the current dataset and candidate
   * @param {string} dataset - 'kepler' or 'tess'
   * @param {string} candidateId - KOI name or TOI name
   */
  setSelection(dataset, candidateId) {
    this.currentDataset = dataset;
    this.currentCandidate = candidateId;
    console.log(`Selected: ${dataset} - ${candidateId}`);
  }

  /**
   * Get available candidates for a dataset
   * @param {string} dataset - 'kepler' or 'tess'
   * @returns {Promise<Array>} List of candidate IDs
   */
  async getCandidates(dataset) {
    try {
      // Call the real API endpoint to get candidates from text files
      const response = await fetch(`/api/autocomplete/${dataset}`);
      if (response.ok) {
        const data = await response.json();
        return data.suggestions || [];
      } else {
        throw new Error(`Failed to load ${dataset} candidates`);
      }
    } catch (error) {
      console.error('Error getting candidates:', error);
      // Return empty array on error - no fallback needed
      return [];
    }
  }

  /**
   * Search for candidates matching a query
   * @param {string} dataset - 'kepler' or 'tess'
   * @param {string} query - search query
   * @returns {Promise<Array>} List of matching candidates
   */
  async searchCandidates(dataset, query) {
    try {
      const allCandidates = await this.getCandidates(dataset);
      if (query) {
        return allCandidates.filter(candidate => 
          candidate.toLowerCase().includes(query.toLowerCase())
        );
      }
      return allCandidates;
    } catch (error) {
      console.error('Error searching candidates:', error);
      return [];
    }
  }

  /**
   * Make a prediction for the current selection
   * @returns {Promise<Object>} Prediction results
   */
  async makePrediction() {
    if (!this.currentDataset || !this.currentCandidate) {
      throw new Error('No dataset or candidate selected');
    }

    try {
      // Call the appropriate API endpoint based on dataset
      let response;
      if (this.currentDataset === 'kepler') {
        response = await fetch('/api/predict/kepler', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            koi_name: this.currentCandidate
          })
        });
      } else if (this.currentDataset === 'tess') {
        response = await fetch('/api/predict/tess', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            toi_name: this.currentCandidate
          })
        });
      } else {
        throw new Error('Invalid dataset selected');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Prediction failed');
      }

      const data = await response.json();
      
      if (data.prediction) {
        return {
          status: 'success',
          dataset: this.currentDataset,
          candidate_id: this.currentCandidate,
          confidence: Math.round(data.prediction.confidence * 100),
          is_exoplanet: data.prediction.is_exoplanet,
          model_version: data.prediction.model_version,
          message: data.message || `Prediction completed for ${this.currentCandidate}`
        };
      } else {
        throw new Error('Invalid response from prediction API');
      }
    } catch (error) {
      return {
        status: 'error',
        message: `Prediction failed: ${error.message}`
      };
    }
  }

  /**
   * Get current selection info
   * @returns {Object} Current selection
   */
  getCurrentSelection() {
    return {
      dataset: this.currentDataset,
      candidate: this.currentCandidate
    };
  }

  /**
   * Clear current selection
   */
  clearSelection() {
    this.currentDataset = null;
    this.currentCandidate = null;
  }
}

// Export singleton instance
export default new PredictionService();
