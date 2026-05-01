import React from "react";
import { useParams } from "react-router-dom";
import CategoryPage from "../components/CategoryPage";

export function DynamicCategoryPage() {
  const { categoryName } = useParams();
  return <CategoryPage title={categoryName} categoryName={categoryName} />;
}

export function Starters() {
  return <CategoryPage title="Starters" categoryName="Starters" />;
}

export function MainCourse() {
  return <CategoryPage title="Main Course" categoryName="Main Course" />;
}

export function SouthIndian() {
  return <CategoryPage title="South Indian" categoryName="South Indian" />;
}

export function IndoChinese() {
  return <CategoryPage title="Indo Chinese" categoryName="Indo Chinese" />;
}

export function Dessert() {
  return <CategoryPage title="Dessert" categoryName="Dessert" />;
}

export function Beverages() {
  return <CategoryPage title="Beverages" categoryName="Beverages" />;
}
