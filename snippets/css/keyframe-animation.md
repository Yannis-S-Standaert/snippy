
keyframe-animation
css
name:class,name:animation
---
.@:name:class:@ {
        animation-name: @:name:animation:@ 1s 0.5s forwards ease-in-out;
    }
    
    @keyframes @:name:animation:@ {
        from {
            opacity: 0;
        }

        50% {
            opacity: 0.5;
        }

        to {
            opacity: 1;
        }
    }
