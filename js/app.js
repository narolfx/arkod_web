$(document).ready(function () {
    const projects = {
        "Project 1": { imageCount: 61, path: 'images/Project 1/', containerId: '#viewer-images-1' },
        "Project 2": { imageCount: 61, path: 'images/Project 2/', containerId: '#viewer-images-2' }
    };

    let isDragging = false;
    let startX;
    let zoomedIn = false; // Track zoom state

    // Function to load images for each project
    function loadImages(projectName) {
        const project = projects[projectName];
        const { imageCount, path, containerId } = project;
        const viewer = $(containerId);
        viewer.empty(); // Clear current images

        for (let i = 0; i < imageCount; i++) {
            const imgElement = `<img src="${path}${i + 1}.jpg" alt="Product Image ${i + 1}" data-index="${i}" style="transform: scale(1);">`;
            viewer.append(imgElement);
        }
        viewer.find('img').first().show(); // Show the first image initially
    }

    // Function to rotate based on slider value
    function rotateBySlider(viewer, value) {
        const images = viewer.find('img');
        images.hide(); // Hide all images
        images.eq(value).show(); // Show the image corresponding to slider value
    }

    // Function to toggle zoom in and out
    function toggleZoom(viewer) {
        const images = viewer.find('img:visible'); // Get the currently visible image
        if (!zoomedIn) {
            images.css('transform', 'scale(1.5)'); // Zoom in
            $('.zoom-toggle i').removeClass('fa-search-plus').addClass('fa-search-minus'); // Change icon to minus
        } else {
            images.css('transform', 'scale(1)'); // Zoom out
            $('.zoom-toggle i').removeClass('fa-search-minus').addClass('fa-search-plus'); // Change icon to plus
        }
        zoomedIn = !zoomedIn; // Toggle zoom state
    }

    // Initialize viewers for all projects
    Object.keys(projects).forEach(projectName => {
        loadImages(projectName);
    });

    // Slider event for rotating images
    $('.rotation-slider').on('input', function() {
        const viewer = $(this).closest('.project').find('.viewer-images');
        const value = $(this).val();
        rotateBySlider(viewer, value);
    });

    // Zoom toggle button event
    $('.zoom-toggle').click(function() {
        const viewer = $(this).closest('.project').find('.viewer-images');
        toggleZoom(viewer);
    });

    // Mouse events for drag rotation
    $('.project-viewer').on('mousedown', function (event) {
        isDragging = true;
        startX = event.pageX;
    });

    $(document).on('mouseup', function () {
        isDragging = false;
    });

    $(document).on('mousemove', function (event) {
        if (isDragging) {
            const viewer = $(event.target).closest('.project').find('.viewer-images');
            const moveX = event.pageX - startX;
            const imageCount = viewer.find('img').length;
            let currentIndex = viewer.find('img:visible').index();
            
            if (Math.abs(moveX) > 15) { // Adjust sensitivity
                if (moveX > 0) {
                    currentIndex = (currentIndex + 1) % imageCount;
                } else {
                    currentIndex = (currentIndex - 1 + imageCount) % imageCount;
                }
                startX = event.pageX;
                viewer.find('img').hide();
                viewer.find('img').eq(currentIndex).show();
                viewer.siblings('.controls').find('.rotation-slider').val(currentIndex); // Update slider
            }
        }
    });
});
