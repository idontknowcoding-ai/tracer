import { createRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const CallStackVisualizer = ({ stack }) => {
  return (
    <div className="call-stack-visualizer paper-shadow">
      <div className="table-header">Call Stack</div>
      <div className="stack-container">
        <TransitionGroup component={null}>
          {[...stack].reverse().map((frame, index) => {
            const nodeRef = createRef(null);
            return (
              <CSSTransition key={frame} timeout={500} classNames="stack-frame" nodeRef={nodeRef}>
                <div ref={nodeRef} className="stack-frame-item" style={{ '--index': index }}>
                  {frame}
                </div>
              </CSSTransition>
            );
          })}
        </TransitionGroup>
        {stack.length === 0 && <div className="empty-stack-placeholder">Stack is empty</div>}
      </div>
    </div>
  );
};

export default CallStackVisualizer;
