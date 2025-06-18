/**
 * Lazy Loading Implementation with Placeholder Support
 * Provides visual feedback during image loading process
 */

class LazyImageLoader {
    constructor() {
        this.imageObserver = null;
        this.loadingImages = new Set();
        this.init();
    }

    init() {
        // Check if Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            // Fallback for older browsers
            this.loadAllImages();
        }

        // Initialize lazy images
        this.setupLazyImages();
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px', // Start loading 50px before image enters viewport
            threshold: 0.1
        };

        this.imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, options);
    }

    setupLazyImages() {
        const lazyImages = document.querySelectorAll('.lazy-image');
        lazyImages.forEach(img => {
            if (this.imageObserver) {
                this.imageObserver.observe(img);
            }
        });
    }

    loadImage(img) {
        if (this.loadingImages.has(img)) {
            return; // Already loading
        }

        this.loadingImages.add(img);
        const placeholder = img.parentElement.querySelector('.loading-placeholder');
        const src = img.dataset.src;

        if (!src) {
            console.warn('No data-src attribute found for lazy image');
            return;
        }

        // Create a new image element to preload
        const imageLoader = new Image();
        
        // Add loading state
        img.classList.add('loading');
        
        imageLoader.onload = () => {
            // Image loaded successfully
            img.src = src;
            img.classList.add('loaded');
            img.classList.remove('loading');
            
            // Update aria-label for accessibility
            img.setAttribute('aria-label', img.alt || 'Image loaded successfully');
            
            // Hide placeholder with animation
            if (placeholder) {
                placeholder.classList.add('hidden');
                
                // Remove placeholder from DOM after animation completes
                setTimeout(() => {
                    if (placeholder.parentElement) {
                        placeholder.remove();
                    }
                }, 300);
            }
            
            this.loadingImages.delete(img);
            
            // Dispatch custom event for successful load
            img.dispatchEvent(new CustomEvent('lazyImageLoaded', {
                detail: { src, element: img }
            }));
        };

        imageLoader.onerror = () => {
            // Handle loading error
            console.error(`Failed to load image: ${src}`);
            img.classList.remove('loading');
            img.classList.add('error');
            img.setAttribute('aria-label', 'Failed to load image');
            
            // Update placeholder to show error state
            if (placeholder) {
                placeholder.innerHTML = `
                    <div class="error-icon">⚠️</div>
                    <p>Failed to load image</p>
                `;
                placeholder.style.background = '#ffebee';
                placeholder.style.color = '#c62828';
                placeholder.setAttribute('aria-live', 'assertive');
                placeholder.setAttribute('aria-label', 'Image failed to load');
            }
            
            this.loadingImages.delete(img);
            
            // Dispatch custom event for failed load
            img.dispatchEvent(new CustomEvent('lazyImageError', {
                detail: { src, element: img }
            }));
        };

        // Start loading the image
        imageLoader.src = src;
    }

    loadAllImages() {
        // Fallback method for browsers without Intersection Observer
        const lazyImages = document.querySelectorAll('.lazy-image');
        lazyImages.forEach(img => {
            this.loadImage(img);
        });
    }

    // Public method to manually trigger loading of a specific image
    loadSpecificImage(img) {
        if (img.classList.contains('lazy-image') && !img.classList.contains('loaded')) {
            this.loadImage(img);
        }
    }

    // Public method to get loading status
    getLoadingStatus() {
        return {
            totalImages: document.querySelectorAll('.lazy-image').length,
            loadingImages: this.loadingImages.size,
            loadedImages: document.querySelectorAll('.lazy-image.loaded').length
        };
    }
}

// Performance monitoring
class LazyLoadingPerformance {
    constructor() {
        this.startTime = performance.now();
        this.imageLoadTimes = new Map();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('lazyImageLoaded', (event) => {
            const loadTime = performance.now() - this.startTime;
            this.imageLoadTimes.set(event.detail.src, loadTime);
            
            console.log(`Image loaded: ${event.detail.src} (${loadTime.toFixed(2)}ms)`);
        });

        document.addEventListener('lazyImageError', (event) => {
            console.error(`Image failed to load: ${event.detail.src}`);
        });
    }

    getPerformanceReport() {
        return {
            totalLoadTime: performance.now() - this.startTime,
            imageLoadTimes: Array.from(this.imageLoadTimes.entries()),
            averageLoadTime: this.getAverageLoadTime()
        };
    }

    getAverageLoadTime() {
        if (this.imageLoadTimes.size === 0) return 0;
        
        const times = Array.from(this.imageLoadTimes.values());
        return times.reduce((sum, time) => sum + time, 0) / times.length;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize lazy loading
    const lazyLoader = new LazyImageLoader();
    
    // Initialize performance monitoring
    const performanceMonitor = new LazyLoadingPerformance();
    
    // Make instances globally available for debugging
    window.lazyLoader = lazyLoader;
    window.performanceMonitor = performanceMonitor;
    
    // Log performance report after 5 seconds
    setTimeout(() => {
        console.log('Performance Report:', performanceMonitor.getPerformanceReport());
        console.log('Loading Status:', lazyLoader.getLoadingStatus());
    }, 5000);
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LazyImageLoader, LazyLoadingPerformance };
}