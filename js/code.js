async function krData() {
  // Очищаем результаты предыдущего запроса
  const productsContainer = document.getElementById('products');
  productsContainer.innerHTML = '';

  // Получаем выбранные значения из выпадающих списков
  const brand_item = document.getElementById('marka').value;
  const type_item = document.getElementById('product').value;


  // Получаем значения диапазона цен
  const minPrice = document.getElementById('min-price').value;
  const maxPrice = document.getElementById('max-price').value;

  try {
    console.log('Fetch MakeUp started...');
    const response = await fetch(
      `http://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand_item}&product_type=${type_item}`
    );
    const data = await response.json();
    console.log('Data:', getValue(data, minPrice, maxPrice));

    
    // Отображение карточек на странице
    const productsContainer = document.getElementById('products');
    
    if (Array.isArray(getValue(data, minPrice, maxPrice))) {
      for (let i = 0; i < getValue(data, minPrice, maxPrice).length; i++) {
        const product = getValue(data, minPrice, maxPrice)[i];
        
        const productCard = `
          <div class="cards">
          <div class="card">
            <img src="${product.image_link}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price}$</p>
          </div>
          </div>
        `;
        
        productsContainer.insertAdjacentHTML('beforeend', productCard);
      }
    } else {
      productsContainer.innerHTML = `<p>${getValue(data, minPrice, maxPrice)}</p>`;
    }
    
  } catch (err) {
    console.error(err);
  }
}

// Фильтруем список продуктов по выбранному бренду и типу продукта
function filterProductsByBrandAndType(products, brand, type) {
  return products.filter(product => product.brand === brand && product.product_type === type);
}

// Обновляем список типов продуктов при выборе бренда
async function updateProductTypeOptions() {
  const brand_item = document.getElementById('marka').value;
  const productTypeDatalist = document.getElementById('product_type');
  // Удаляем все текущие элементы option из datalist
  while (productTypeDatalist.firstChild) {
    productTypeDatalist.removeChild(productTypeDatalist.firstChild);
  }
  // Получаем список продуктов для выбранного бренда и создаем новые элементы option для всех типов продуктов
  try {
    const response = await fetch(`http://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand_item}`);
    const data = await response.json();
    const productTypes = new Set(data.map(product => product.product_type)); // Используем Set для удаления дубликатов
    productTypes.forEach(productType => {
      const option = document.createElement('option');
      option.value = productType;
      productTypeDatalist.appendChild(option);
    });
  } catch (err) {
    console.error(err);
  }
}

// Добавляем обработчик события для поля выбора бренда, который обновляет список типов продуктов
const brandInput = document.getElementById('marka');
brandInput.addEventListener('change', updateProductTypeOptions);



function getValue(array, minPrice, maxPrice) {
  const spisok = [];

  for (let i = 0; i < array.length; i++) {
    const productPrice = parseFloat(array[i].price.replace('$', ''));
    if ((minPrice === '' || productPrice >= minPrice) && (maxPrice === '' || productPrice <= maxPrice)) {
      spisok.push({
        brand: array[i].brand,
        name: array[i].name,
        description: array[i].description,
        image_link: array[i].image_link,
        price: array[i].price,
      });
    }
  }

  if (spisok.length >= 1) {
    return spisok;
  } else {
    return 'Sorry, but this cosmetic product is not available.';
  }
}

// Добавляем обработчик события для кнопки сортировки
const sortButton1 = document.getElementById('sort-asc');
sortButton1.addEventListener('click', sortProducts1);

function sortProducts1() {
  const productsContainer1 = document.getElementById('products');
  const cards = productsContainer1.querySelectorAll('.card');
  
  // Преобразуем NodeList в массив
  const cardsArray1 = Array.from(cards);
  
  // Сортируем массив карточек по цене
  cardsArray1.sort((a, b) => {
    const aPrice = parseFloat(a.querySelector('p').textContent.replace('$', ''));
    const bPrice = parseFloat(b.querySelector('p').textContent.replace('$', ''));
    
    return aPrice - bPrice;
  });

  // Удаляем все карточки из контейнера
  productsContainer1.innerHTML = '';
  
  // Добавляем отсортированные карточки в контейнер
  cardsArray1.forEach(card => {
    productsContainer1.appendChild(card);
  });
  }

  const sortButton2 = document.getElementById('sort-desc');
sortButton2.addEventListener('click', sortProducts2);

function sortProducts2() {
  const productsContainer2 = document.getElementById('products');
  const cards = productsContainer2.querySelectorAll('.card');
  
  // Преобразуем NodeList в массив
  const cardsArray2 = Array.from(cards);
  
  // Сортируем массив карточек по цене
  cardsArray2.sort((a, b) => {
    const aPrice = parseFloat(a.querySelector('p').textContent.replace('$', ''));
    const bPrice = parseFloat(b.querySelector('p').textContent.replace('$', ''));
    
    return bPrice - aPrice;
  });

  // Удаляем все карточки из контейнера
  productsContainer2.innerHTML = '';
  
  // Добавляем отсортированные карточки в контейнер
  cardsArray2.forEach(card => {
    productsContainer2.appendChild(card);
  });
  }

  
// Получаем список брендов
async function getBrands() {
  try {
    const response = await fetch('http://makeup-api.herokuapp.com/api/v1/products.json');
    const data = await response.json();
    const brands = new Set(data.map(product => product.brand)); // Используем Set для удаления дубликатов
    return Array.from(brands);
  } catch (err) {
    console.error(err);
  }
}

// Получаем список типов продуктов
async function getProductTypes() {
  try {
    const response = await fetch('http://makeup-api.herokuapp.com/api/v1/products.json');
    const data = await response.json();
    const productTypes = new Set(data.map(product => product.product_type)); // Используем Set для удаления дубликатов
    return Array.from(productTypes);
  } catch (err) {
    console.error(err);
  }
}

// Создаем элементы option для списка брендов
async function createBrandOptions() {
  const brands = await getBrands();
  const brandDatalist = document.getElementById('brand');
  brands.forEach(brand => {
    const option = document.createElement('option');
    option.value = brand;
    brandDatalist.appendChild(option);
  });
}
createBrandOptions();

// Создаем элементы option для списка типов продуктов
async function createProductTypeOptions() {
  const productTypes = await getProductTypes();
  const productTypeDatalist = document.getElementById('product_type');
  productTypes.forEach(productType => {
    const option = document.createElement('option');
    option.value = productType;
    productTypeDatalist.appendChild(option);
  });
}

// Вызываем функции для создания элементов option при загрузке страницы

createProductTypeOptions();

