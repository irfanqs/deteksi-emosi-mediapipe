/**
 * Face API Initialization Utility
 * 
 * This module provides utilities for initializing and managing face-api.js
 * for emotion detection. It handles model loading, browser compatibility checks,
 * and error handling.
 * 
 * Requirements: 1.2, 11.2
 */

import * as faceapi from 'face-api.js';

/**
 * Error thrown when face-api.js initialization fails
 */
export class FaceApiInitializationError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'FaceApiInitializationError';
  }
}

/**
 * Check if the browser supports required APIs for face detection
 * 
 * @returns true if browser is compatible, false otherwise
 */
export function checkBrowserSupport(): { supported: boolean; missingFeatures: string[] } {
  const missingFeatures: string[] = [];

  // Check for Canvas API
  if (!document.createElement('canvas').getContext) {
    missingFeatures.push('Canvas API');
  }

  // Check for WebGL (required for TensorFlow.js)
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    missingFeatures.push('WebGL');
  }

  // Check for getUserMedia (camera access)
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    missingFeatures.push('getUserMedia API');
  }

  return {
    supported: missingFeatures.length === 0,
    missingFeatures
  };
}

/**
 * Initialize face-api.js models
 * 
 * Loads the TinyFaceDetector and FaceExpressionNet models from the /models directory.
 * These models are required for emotion detection.
 * 
 * @param modelsPath - Path to the models directory (default: '/models')
 * @returns Promise that resolves when models are loaded
 * @throws {FaceApiInitializationError} If model loading fails or browser is not supported
 * 
 * Requirements: 1.2, 11.2
 */
export async function initializeFaceApi(modelsPath: string = '/models'): Promise<void> {
  try {
    // Check browser support first
    const { supported, missingFeatures } = checkBrowserSupport();
    if (!supported) {
      throw new FaceApiInitializationError(
        `Browser does not support required features: ${missingFeatures.join(', ')}. ` +
        'Please use a modern browser like Chrome, Firefox, or Edge.'
      );
    }

    // Load TinyFaceDetector model (lightweight face detection)
    await faceapi.nets.tinyFaceDetector.loadFromUri(modelsPath);

    // Load FaceExpressionNet model (emotion detection)
    await faceapi.nets.faceExpressionNet.loadFromUri(modelsPath);

    console.log('Face-api.js models loaded successfully');
  } catch (error) {
    // Provide descriptive error messages
    if (error instanceof FaceApiInitializationError) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Check for common error scenarios
    if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
      throw new FaceApiInitializationError(
        'Failed to load face-api.js models. Model files not found at ' + modelsPath + '. ' +
        'Please ensure model files are placed in the /public/models directory.',
        error instanceof Error ? error : undefined
      );
    }

    if (errorMessage.includes('NetworkError') || errorMessage.includes('Failed to fetch')) {
      throw new FaceApiInitializationError(
        'Network error while loading face-api.js models. Please check your internet connection.',
        error instanceof Error ? error : undefined
      );
    }

    // Generic error
    throw new FaceApiInitializationError(
      'Failed to initialize face-api.js: ' + errorMessage,
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Check if face-api.js models are loaded
 * 
 * @returns true if both required models are loaded, false otherwise
 */
export function areModelsLoaded(): boolean {
  return (
    faceapi.nets.tinyFaceDetector.isLoaded &&
    faceapi.nets.faceExpressionNet.isLoaded
  );
}

/**
 * Get the default options for TinyFaceDetector
 * 
 * @returns TinyFaceDetectorOptions with sensible defaults
 */
export function getDefaultFaceDetectorOptions(): faceapi.TinyFaceDetectorOptions {
  return new faceapi.TinyFaceDetectorOptions({
    inputSize: 416, // Higher input size for better accuracy (default: 416)
    scoreThreshold: 0.5 // Confidence threshold for face detection (default: 0.5)
  });
}
