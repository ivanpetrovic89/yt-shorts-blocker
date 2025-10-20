// Define selectors for Shorts on different pages
const pageSelectors = {
    main: '.style-scope ytd-rich-shelf-renderer',
    sidebar: 'a#endpoint.yt-simple-endpoint.style-scope.ytd-guide-entry-renderer[title="Shorts"]',
    channel: '#tabsContent > yt-tab-group-shape > div.yt-tab-group-shape-wiz__tabs > yt-tab-shape:nth-child(3)',
    video: 'ytd-reel-shelf-renderer',
    shortsShelf: 'grid-shelf-view-model.ytGridShelfViewModelHost.ytd-item-section-renderer.ytGridShelfViewModelHostHasBottomButton',
    shortsVideos: 'ytd-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"])'
};

// Set to track processed elements
const processedElements = new WeakSet();

// Function to block Shorts
function blockShorts() {
    Object.values(pageSelectors).forEach((selector) => {
        // Query elements matching the current selector
        const elements = document.querySelectorAll(selector);

        elements.forEach((element) => {
            // Only process elements that haven't been handled yet
            if (!processedElements.has(element)) {
                element.style.display = 'none';
                processedElements.add(element); // Mark element as processed
            }
        });
    });
}

// Throttle function to limit the frequency of blockShorts execution
function throttle(fn, delay) {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            fn(...args);
        }
    };
}

// Throttled version of blockShorts
const throttledBlockShorts = throttle(blockShorts, 200); // 200ms throttle

// Observe DOM changes to block dynamically loaded Shorts
function observeMutations() {
    const observer = new MutationObserver(() => {
        throttledBlockShorts();
    });

    // Limit the observer to the document body and relevant child nodes
    observer.observe(document.body, { childList: true, subtree: true });
}

// Initialize the blocker
blockShorts();
observeMutations();
