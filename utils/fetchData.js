export async function fetchAllCardsData(searchTerm, filters, page, limit) {
  let url = `/api/cards`;

  //converting searchParams object to URLSearchParams
  //to handle encoding and query string construction
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);

  if (searchTerm && searchTerm.trim()) {
    params.append("search", encodeURIComponent(searchTerm.trim()));
  }
  ["conditions", "category", "availability"].forEach(filterKey => {
    if (filters[filterKey]) {
      params.append(filterKey, filters[filterKey]);
    }
  });

  //checking for `undefined` to ensure these parameters are appended even when their value is `0`
  //unlike other values that are appended if they have a truthy value.
  if (filters.priceFrom !== undefined) {
    params.append("priceFrom", filters.priceFrom);
  }
  if (filters.priceTo !== undefined) {
    params.append("priceTo", filters.priceTo);
  }

  const queryString = params.toString();
  console.log("queryString", queryString);
  if (queryString) {
    url += `?${queryString}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    const data = await response.json();
    console.log(data.errors);
    const detailedErrorMessage = data.errors ? data.errors.join(", ") : data.message;
    throw new Error(detailedErrorMessage || "Unknown error occurred.");
  }
  const data = await response.json();
  return data.data;
}

export async function fetchCardData(id) {
  const response = await fetch(`/api/cards/${id}`);
  if (!response.ok) {
    console.log(data.errors);
    const detailedErrorMessage = data.errors ? data.errors.join(", ") : data.message;
    throw new Error(detailedErrorMessage || "Unknown error occurred.");
  }
  const data = await response.json();
  return data.data;
}

export async function editCardData(id, editCardData) {
  const response = await fetch(`/api/cards/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(editCardData)
  });
  if (!response.ok) {
    console.log(data.errors);
    const detailedErrorMessage = data.errors ? data.errors.join(", ") : data.message;
    throw new Error(detailedErrorMessage || "Unknown error occurred.");
  }
  const data = await response.json();
  return data.data;
}

export async function createCardData(formData) {
  const response = await fetch("/api/cards", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  });
  if (!response.ok) {
    console.log(data.errors);
    const detailedErrorMessage = data.errors ? data.errors.join(", ") : data.message;
    throw new Error(detailedErrorMessage || "Unknown error occurred.");
  }
  const data = await response.json();
  return data.data;
}

export async function fetchSellerCards(sellerId, filters, page, limit) {
  let url = `/api/cards/seller/${sellerId}`;
  console.log("url", url);

  //converting searchParams object to URLSearchParams
  //to handle encoding and query string construction
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);

  ["conditions", "category", "availability"].forEach(filterKey => {
    if (filters[filterKey]) {
      params.append(filterKey, filters[filterKey]);
    }
  });

  //checking for `undefined` to ensure these parameters are appended even when their value is `0`
  //unlike other values that are appended if they have a truthy value.
  if (filters.priceFrom !== undefined) {
    params.append("priceFrom", filters.priceFrom);
  }
  if (filters.priceTo !== undefined) {
    params.append("priceTo", filters.priceTo);
  }

  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }
  console.log("url1", url);
  const response = await fetch(url);
  if (!response.ok) {
    console.log(data.errors);
    const detailedErrorMessage = data.errors ? data.errors.join(", ") : data.message;
    throw new Error(detailedErrorMessage || "Unknown error occurred.");
  }
  const data = await response.json();
  return data.data;
}

export async function fetchSellerData(id) {
  const response = await fetch(`/api/seller/${id}`);
  if (!response.ok) {
    console.log(data.errors);
    const detailedErrorMessage = data.errors ? data.errors.join(", ") : data.message;
    throw new Error(detailedErrorMessage || "Unknown error occurred.");
  }
  const data = await response.json();
  return data.data;
}
