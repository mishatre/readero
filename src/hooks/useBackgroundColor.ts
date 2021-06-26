import { useEffect } from "react";

function useBackgroundColor(color: string) {
    useEffect(() => {
        document.documentElement.style.backgroundColor = color;
        document.body.style.backgroundColor = color;
    }, [color]);
}

export default useBackgroundColor;