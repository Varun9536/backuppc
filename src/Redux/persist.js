// redux/persist.js
export const loadState = () => {
    try {
        const serializedState = localStorage.getItem("userState");
        if (!serializedState) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (e) {
        console.error("Load state error:", e);
        return undefined;
    }
};

export const saveState = (state) => {
    try {
        localStorage.setItem("userState", JSON.stringify(state));
    } catch (e) {
        console.error("Save state error:", e);
    }
};
