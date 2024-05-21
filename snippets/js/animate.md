
animate
js

---
 const keyframes = [
        { transform: 'translateX(0px)' },
        { transform: 'translateX(100px)' }
    ];
    const options = {
        duration: 1000,
        iterations: Infinity,
        fill: 'forwards'
        easing: 'ease-in-out'
    };
    element.animate(keyframes, options);
