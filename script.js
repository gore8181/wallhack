document.addEventListener('DOMContentLoaded', function() {
    const discoverBtn = document.getElementById('discoverBtn');
    const heroContent = document.querySelector('.hero-content');
    const imageWrapper = document.querySelector('.image-wrapper');
    const slideshowContainer = document.querySelector('.slideshow-container');
    const slides = document.querySelectorAll('.slideshow-slide');
    const prevBtn = document.querySelector('.slideshow-prev');
    const nextBtn = document.querySelector('.slideshow-next');
    const dots = document.querySelectorAll('.dot');
    
    let currentSlide = 0;
    let slideInterval;
    let isSlideshow = false;
    let isTransitioning = false;
    
    // Function to show a specific slide without animations (initial state)
    function showInitialSlide(index) {
        // Hide all slides first
        slides.forEach(slide => {
            slide.style.display = 'none';
            slide.classList.remove('active');
        });
        
        // Show only the selected slide
        slides[index].style.display = 'flex';
        slides[index].classList.add('active');
        
        // Activate the dot
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        
        // Update current slide index
        currentSlide = index;
    }
    
    // Function to show a specific slide with animations (after button click)
    function showSlideWithAnimation(index) {
        if (isTransitioning) return; // Prevent rapid transitions
        isTransitioning = true;
        
        const currentActive = document.querySelector('.slideshow-slide.active');
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // First, prepare the new slide
        slides[index].style.display = 'flex';
        slides[index].classList.add('with-animation', 'next');
        
        // Wait a moment for display to take effect
        setTimeout(() => {
            // Start fade out of current slide
            if (currentActive) {
                currentActive.classList.remove('revealed');
                
                // After current slide starts fading out
                setTimeout(() => {
                    // Start fade in of new slide
                    slides[index].classList.remove('next');
                    slides[index].classList.add('active');
                    
                    if (isSlideshow) {
                        // Add revealed class to make it fully visible
                        setTimeout(() => {
                            slides[index].classList.add('revealed');
                        }, 100);
                    }
                    
                    // After new slide is visible, clean up old slide
                    setTimeout(() => {
                        if (currentActive) {
                            currentActive.classList.remove('active', 'with-animation');
                            currentActive.style.display = 'none';
                        }
                        isTransitioning = false;
                    }, 500);
                    
                }, 500);
            } else {
                // No current slide (first load)
                slides[index].classList.remove('next');
                slides[index].classList.add('active');
                
                if (isSlideshow) {
                    // Add revealed class to make it fully visible
                    setTimeout(() => {
                        slides[index].classList.add('revealed');
                    }, 100);
                }
                
                isTransitioning = false;
            }
            
            // Activate current dot
            dots[index].classList.add('active');
            
            // Update current slide index
            currentSlide = index;
        }, 50);
    }
    
    // Function to go to the next slide
    function nextSlide() {
        if (isTransitioning) return;
        const nextIndex = (currentSlide + 1) % slides.length;
        if (isSlideshow) {
            showSlideWithAnimation(nextIndex);
        } else {
            showInitialSlide(nextIndex);
        }
    }
    
    // Function to go to the previous slide
    function prevSlide() {
        if (isTransitioning) return;
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        if (isSlideshow) {
            showSlideWithAnimation(prevIndex);
        } else {
            showInitialSlide(prevIndex);
        }
    }
    
    // Function to start the slideshow interval
    function startSlideshow() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 7000); // Change slide every 7 seconds to allow for longer transitions
    }
    
    // Set up click handlers
    discoverBtn.addEventListener('click', function() {
        // Hide the content
        heroContent.classList.add('hidden');
        
        // Show the full image wrapper
        setTimeout(() => {
            // Add animation class to all slides before expanding
            slides.forEach(slide => {
                slide.classList.add('with-animation');
            });
            
            imageWrapper.classList.add('fullscreen');
            isSlideshow = true;
            
            // Add revealed class to current slide with animation
            slides[currentSlide].classList.add('revealed');
            startSlideshow();
        }, 300);
    });
    
    // Previous button click
    prevBtn.addEventListener('click', function() {
        prevSlide();
        if (isSlideshow) {
            // Reset the interval when manually changing slides
            startSlideshow();
        }
    });
    
    // Next button click
    nextBtn.addEventListener('click', function() {
        nextSlide();
        if (isSlideshow) {
            // Reset the interval when manually changing slides
            startSlideshow();
        }
    });
    
    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            if (isSlideshow) {
                showSlideWithAnimation(index);
                startSlideshow();
            } else {
                showInitialSlide(index);
            }
        });
    });
    
    // Initialize the first slide without animations
    showInitialSlide(0);
    
    // Pause slideshow when hovering over controls
    slideshowContainer.addEventListener('mouseenter', function() {
        if (isSlideshow && slideInterval) {
            clearInterval(slideInterval);
        }
    });
    
    // Resume slideshow when moving away from controls
    slideshowContainer.addEventListener('mouseleave', function() {
        if (isSlideshow) {
            startSlideshow();
        }
    });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!isSlideshow) return;
        
        if (e.key === 'ArrowLeft') {
            prevSlide();
            startSlideshow();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            startSlideshow();
        }
    });
}); 