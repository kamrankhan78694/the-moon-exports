# The Moon Exports - Lazy Loading with Placeholders

A modern implementation of lazy loading with placeholder images to improve user experience during image loading.

## Features

- **Placeholder Animation**: Shows an animated placeholder with loading spinner while images load
- **Smooth Transitions**: Fade-in animation when images finish loading
- **Intersection Observer**: Efficient lazy loading using modern browser APIs
- **Error Handling**: Graceful error states for failed image loads
- **Performance Monitoring**: Built-in performance tracking and reporting
- **Responsive Design**: Works across all device sizes
- **Fallback Support**: Compatible with older browsers

## How It Works

1. **Initial State**: Images are hidden and placeholders are shown
2. **Viewport Detection**: Intersection Observer detects when images enter the viewport
3. **Progressive Loading**: Images load with a 50px margin before entering viewport
4. **Visual Feedback**: Animated placeholders provide loading feedback
5. **Smooth Transition**: Images fade in smoothly when loaded
6. **Error Handling**: Failed loads show error state instead of broken images

## Technical Implementation

### HTML Structure
```html
<div class="image-container">
    <img class="lazy-image" 
         data-src="path/to/image.jpg" 
         alt="Description">
    <div class="loading-placeholder">
        <div class="loading-spinner"></div>
        <p>Loading...</p>
    </div>
</div>
```

### CSS Features
- Animated background pattern for placeholders
- CSS spinner animation
- Smooth opacity transitions
- Responsive grid layout
- Error state styling

### JavaScript Features
- `LazyImageLoader` class for core functionality
- `LazyLoadingPerformance` class for monitoring
- Custom events for load success/failure
- Intersection Observer with configurable margins
- Fallback for older browsers

## Browser Support

- **Modern Browsers**: Full feature support with Intersection Observer
- **Legacy Browsers**: Fallback to immediate loading
- **Mobile Browsers**: Optimized for touch devices

## Performance Benefits

- Reduced initial page load time
- Lower bandwidth usage
- Better perceived performance
- Improved Core Web Vitals scores

## Usage

Simply open `index.html` in a web browser to see the lazy loading with placeholders in action.

## Customization

### Placeholder Styling
Modify the `.loading-placeholder` CSS class to customize the placeholder appearance.

### Loading Margin
Adjust the `rootMargin` in the Intersection Observer options to change when images start loading.

### Animation Duration
Modify CSS transition and animation durations to match your design needs.

## Development

The implementation is vanilla JavaScript with no external dependencies, making it lightweight and easy to integrate into any project.