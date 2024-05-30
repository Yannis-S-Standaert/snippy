
wavey-right
css
name:className
---
.@:name:className:@ {
  --mask:
    radial-gradient(22.63px at calc(100% - 32px) 50%,#000 99%,#0000 101%) 0 calc(50% - 32px)/100% 64px,
    radial-gradient(22.63px at calc(100% + 16px) 50%,#0000 99%,#000 101%) calc(100% - 16px) 50%/100% 64px repeat-y;
  -webkit-mask: var(--mask);
          mask: var(--mask);
  background: linear-gradient(-90deg, rgb(255 0 139) 0%, rgb(0 217 255) 100%);
  background: linear-gradient(-90deg, rgb(255 0 139) 0%, rgb(0 217 255) 100%);
  height: 100vh;
  width: 320px;
  border-radius: 16px;
  overflow: hidden;
}

.@:name:className:@:hover {
  animation: slide-in-spring 500ms ease-in-out;
}

@keyframes slide-in-spring {
  from {
    width: 320px;
  }
  25% {
    width: 330px;
  }
  50% {
    width: 315px;
  }
  75% {
    width: 322px;
  }
  to {
    width: 320px;
  }
}
