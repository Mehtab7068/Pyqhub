import { useEffect } from 'react';

const useLeaveTestGuard = (isActive, onLeave) => {
    useEffect(() => {
        if (!isActive) return undefined;

        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = '';
        };

        const handlePopState = () => {
            const shouldLeave = window.confirm('Are you sure you want to leave this practice? Your current progress will be lost.');
            if (shouldLeave) {
                onLeave();
                return;
            }
            window.history.pushState({ testGuard: true }, '', window.location.href);
        };

        window.history.pushState({ testGuard: true }, '', window.location.href);
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [isActive, onLeave]);
};

export default useLeaveTestGuard;
