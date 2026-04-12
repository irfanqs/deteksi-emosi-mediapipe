# MoodJournal Component

## Overview

The `MoodJournal` component provides a comprehensive interface for users to add context to their emotion entries through text, voice recordings, and photos.

## Features

### 1. Text Editor
- Multi-line textarea for writing journal entries
- Character counter
- Placeholder text for guidance

### 2. Voice Recording
- Start/stop recording functionality
- Real-time recording duration display
- Audio playback preview
- Delete recorded audio
- Automatic microphone resource cleanup

### 3. Photo Capture/Upload
- File upload with image preview
- File type validation (images only)
- File size validation (max 5MB)
- Delete uploaded photo
- Supported formats: JPG, PNG, GIF

## Props

```typescript
interface MoodJournalProps {
  emotionEntryId: string;           // Required: ID of the emotion entry to link to
  onSaveSuccess?: (journal: JournalData) => void;  // Optional: Callback on successful save
  onCancel?: () => void;             // Optional: Callback when user cancels
}
```

## Usage

```tsx
import MoodJournal from '@/components/MoodJournal';

function MyPage() {
  const handleSaveSuccess = (journal) => {
    console.log('Journal saved:', journal);
    // Navigate to next page or show success message
  };

  const handleCancel = () => {
    console.log('User cancelled');
    // Navigate back or close modal
  };

  return (
    <MoodJournal
      emotionEntryId="emotion-entry-123"
      onSaveSuccess={handleSaveSuccess}
      onCancel={handleCancel}
    />
  );
}
```

## API Integration

The component calls `POST /api/journals` with the following payload:

```typescript
{
  emotionEntryId: string;
  textContent?: string;      // Optional: Journal text
  voiceNoteUrl?: string;     // Optional: Voice note URL
  photoUrl?: string;         // Optional: Photo URL
}
```

**Note:** In the current implementation (Task 13.1), file URLs are passed as strings. Task 13.2 will implement actual file upload functionality.

## Validation

- At least one field (text, voice, or photo) must be provided
- Photo files must be valid images
- Photo files must be under 5MB
- Microphone permission required for voice recording

## Error Handling

The component handles the following error scenarios:
- Microphone permission denied
- Invalid file type
- File size exceeds limit
- API save failures
- Network errors

## Accessibility

- Proper label associations for form inputs
- Keyboard navigation support
- ARIA labels for icon buttons
- Focus management

## Browser Compatibility

- Requires MediaRecorder API for voice recording
- Requires getUserMedia API for microphone access
- Modern browsers (Chrome, Firefox, Safari, Edge)

## Requirements Satisfied

- **3.1**: Provides options to add text content, voice note, or photo
- **3.2**: Saves text content as Journal entry linked to EmotionEntry
- **3.3**: Records voice note and saves URL in Journal entry
- **3.4**: Captures photo and saves URL in Journal entry

## Future Enhancements (Task 13.2)

- Actual file upload to backend storage
- Progress indicators for file uploads
- Retry mechanism for failed uploads
- File compression for photos
- Audio format conversion
