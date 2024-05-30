
grid-background
css
name:className
---
.@:name:className:@ {
  --_dot-color: #dedeff;
  --_border-color: #8585de;
  background: radial-gradient(var(--_dot-color) 7%, transparent 7%) repeat, radial-gradient(var(--_dot-color) 7%, transparent 7%) repeat;
  background-size: 64px 64px, 16px 16px;
  background-position: 0 0, 8px 8px;
  width: 100%;
  min-height: 400px;
  border: 1px solid var(--_border-color);
}
