import { create } from 'zustand';

type LocationState = {
    currentLocation: string;
    setLocation: (location: string) => void;
}

const useLocationStore = create<LocationState>((set) => ({
    currentLocation: "New York, NY",

    setLocation: (location: string) => {
        set({ currentLocation: location });
    }
}));

export default useLocationStore;
