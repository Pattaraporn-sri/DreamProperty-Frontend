import React, { createContext, useState, useContext, useEffect } from "react";

interface FavoriteContextType {
  favorites: Record<string, boolean>;
  toggleFavorite: (id: string) => void;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(
  undefined
);

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoriteProvider");
  }
  return context;
};

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  
  //ดึงข้อมูลรายการโปรดจาก localStorage หากมี
  const loadFavoriteFromStorage = () => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : {};
  };

  const [favorites, setFavorites] = useState<Record<string, boolean>>(
    loadFavoriteFromStorage
  );

  //อัพเดต localstorage เมื่อ favorite เปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prevFavorites) => {
      const newFavorites = { ...prevFavorites, [id]: !prevFavorites[id] };
      return newFavorites;
    });
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};
