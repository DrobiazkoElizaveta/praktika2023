async function krData(brand_item, type_item) {
    brand_item = document.getElementById('marka').value
    type_item = document.getElementById('product').value
    
    try{
      console.log('Fetch MakeUp started...')
      const response = await fetch(
        `http://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand_item}&product_type=${type_item}`
        )
      const data = await response.json()
      console.log('Data:', getValue(data))

      let list = document.querySelector('.table-responsive')
      
      for (i in getValue(data)) {

        list.innerHTML += `
        <div class="table-responsive"><table>
	<tbody>
		<tr>
			<td rowspan="3"><img src="${getValue(data)[i].image_link}" width="300px"></td>
			<td>${getValue(data)[i].name}</td>
		</tr>
		<tr>
			<td>${getValue(data)[i].description}</td>
		</tr>
		<tr>
			<td>${getValue(data)[i].price}</td>
		</tr>
	</tbody>
</table></div>

        `
      }

    } catch (err) {
      console.error(err);
    }
  }
  
  function getValue(array) {
    const spisok = []
    for (let i = 0; i < array.length; i++) {
        spisok[i] = {
        brand: array[i].brand,
        name: array[i].name,
        description: array[i].description,
        image_link: array[i].image_link,
        price: array[i].price,
      }
    }
    if (array.length >= 1) {
      return spisok
    } else {
      return 'Sorry, but this cosmetic product is not available.'
    }
  }
  