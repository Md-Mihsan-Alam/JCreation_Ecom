export const API_URL = import.meta.env.VITE_API_URL || "https://jcreation-ecom.onrender.com";

export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accessories", label: "Accessories" },
      { id: "footwear", label: "Footwear" },
    ],
  },
  {
    label: "Collection",
    name: "brand",
    componentType: "select",
    options: [
      { id: "sherwani", label: "Sherwani" },
      { id: "panjabi", label: "Panjabi" },
      { id: "kurta", label: "Kurta" },
      { id: "pajama", label: "Pajama" },
      { id: "shirt", label: "Shirt" },
      { id: "suite", label: "Suite" },
      { id: "indo-western", label: "Indo Western" },
      { id: "pathani", label: "Pathani" },
      { id: "shoe", label: "Shoe" },
      { id: "nagra", label: "Nagra" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Stock (Size M)",
    name: "stockM",
    componentType: "input",
    type: "number",
    placeholder: "Enter stock for size M",
  },
  {
    label: "Stock (Size L)",
    name: "stockL",
    componentType: "input",
    type: "number",
    placeholder: "Enter stock for size L",
  },
  {
    label: "Stock (Size XL)",
    name: "stockXL",
    componentType: "input",
    type: "number",
    placeholder: "Enter stock for size XL",
  },
  {
    label: "Stock (Size 2XL)",
    name: "stock2XL",
    componentType: "input",
    type: "number",
    placeholder: "Enter stock for size 2XL",
  },
  {
    label: "Stock (Size 3XL)",
    name: "stock3XL",
    componentType: "input",
    type: "number",
    placeholder: "Enter stock for size 3XL",
  },
  {
    label: "Stock (Size 4XL)",
    name: "stock4XL",
    componentType: "input",
    type: "number",
    placeholder: "Enter stock for size 4XL",
  },
  {
    label: "New Arrival",
    name: "isNewArrival",
    componentType: "checkbox",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/product",
  },
  {
    id: "men",
    label: "Men",
    path: "/shop/product",
  },
  {
    id: "footwear",
    label: "Footwear",
    path: "/shop/product",
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/shop/product",
  },
  {
    id: "women",
    label: "Women",
    path: "/shop/product",
  },
  {
    id: "kids",
    label: "Kids",
    path: "/shop/product",
  },
];

export const categoryOptionsMap = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  accessories: "Accessories",
  footwear: "Footwear",
};

export const brandOptionsMap = {
  sherwani: "Sherwani",
  panjabi: "Panjabi",
  pajama: "Pajama",
  shirt: "Shirt",
  suite: "Suites",
  koti: "Koti",
  "indo-western": "Indo Western",
  pathani: "Pathani",
  shoe: "Shoe",
  nagra: "Nagra",
};

export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "accessories", label: "Accessories" },
    { id: "footwear", label: "Footwear" },
  ],
  collection: [
    { id: "sherwani", label: "Sherwani" },
    { id: "panjabi", label: "Panjabi" },
    { id: "koti", label: "Koti" },
    { id: "pajama", label: "Pajama" },
    { id: "shirt", label: "Shirt" },
    { id: "suite", label: "Suites" },
    { id: "indo-western", label: "Indo Western" },
    { id: "pathani", label: "Pathani" },
    { id: "shoe", label: "Shoe" },
    { id: "nagra", label: "Nagra" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
