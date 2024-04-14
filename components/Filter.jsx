import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  Box,
  Slider,
  Typography,
  Stack,
  FormControl,
  FormControlLabel,
  Chip,
  Link,
  RadioGroup,
  Radio
} from "@mui/material";
import SelectComponent from "./SelectComponent";
import useDebounce from "@/hooks/useDebounce";

/**
 * @param {object} props
 * @param {object} props.filtersParams
 * @param {boolean} [props.sellerPage]
 * @param {string} [props.sellerId]
 */

const categories = ["Magic", "Pokemon", "Digimon", "Yu-Gi-Oh!", "Sport Card"];
const conditionsByCardCategory = {
  "Magic": ["Near Mint", "Lightly Played", "Moderately Played", "Heavily Played", "Damaged"],
  "Pokemon": ["Near Mint", "Lightly Played", "Moderately Played", "Heavily Played", "Damaged"],
  "Digimon": ["Near Mint", "Lightly Played", "Moderately Played", "Heavily Played", "Damaged"],
  "Yu-Gi-Oh!": ["Near Mint", "Lightly Played", "Moderately Played", "Heavily Played", "Damaged"],
  "Sport Card": ["Near Mint", "Excellent", "Very good", "Poor"]
};

const Filter = ({ filtersParams, sellerPage = false, sellerId = null }) => {
  const [conditionsOptions, setConditionsOptions] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    conditions: "",
    availability: "",
    search: "",
    priceFrom: filtersParams.priceFrom || "0",
    priceTo: filtersParams.priceTo || "5000"
  });
  //debounce each priceFrom and priceTo separately to prevent multiple API calls
  const debouncedPriceFrom = useDebounce(filters.priceFrom, 500);
  const debouncedPriceTo = useDebounce(filters.priceTo, 500);

  const router = useRouter();
  const searchParams = useSearchParams();

  const areFiltersApplied = Object.values(filters).some(value => value);

  useEffect(() => {
    setFilters({
      search: filtersParams.search || "",
      category: filtersParams.category || "",
      conditions: filtersParams.conditions || "",
      availability: filtersParams.availability || "",
      priceFrom: filtersParams.priceFrom || "",
      priceTo: filtersParams.priceTo || ""
    });
    //rendering correct conditions after redirection from other page with category in the params
    setConditionsOptions(filtersParams.category ? conditionsByCardCategory[filtersParams.category] || [] : []);
  }, [searchParams]);

  useEffect(() => {
    updateQueryStringAndNavigate();
  }, [
    debouncedPriceFrom,
    debouncedPriceTo,
    filters.availability,
    filters.category,
    filters.conditions,
    filters.search,
    filtersParams.category,
    filtersParams.search,
    sellerPage
  ]);

  const updateQueryStringAndNavigate = () => {
    //creating a new URLSearchParams object from the current search parameters.
    const queryParams = new URLSearchParams();
    //checking if the current price range is default (0 to 5000)
    const defaultPriceRange = filters.priceFrom === "0" && filters.priceTo === "5000";
    //adding filter to queryParams if value is truthy and not part of default price range
    Object.entries(filters).forEach(([key, value]) => {
      if (value && !(defaultPriceRange && (key === "priceFrom" || key === "priceTo"))) {
        queryParams.set(key, value);
      }
    });
    //constructing the new URL with the updated query parameters.
    let newUrl = !sellerPage
      ? `/market/?${queryParams.toString()}`
      : `/market/seller/${sellerId}/?${queryParams.toString()}`;
    router.push(newUrl);
  };

  const handleFilterChange = (filterId, value) => {
    //rendering correct conditions' options based on the selected category in the select form
    //and resetting the conditions filter to ensure consistency. Else, just updating the filter with the new value.
    if (filterId === "category") {
      setConditionsOptions(value ? conditionsByCardCategory[value] || [] : []);
      setFilters(prevFilters => ({ ...prevFilters, category: value, conditions: "" }));
    } else {
      setFilters(prevFilters => ({ ...prevFilters, [filterId]: value }));
    }
  };

  const handlePriceRangeChange = (event, newValue) => {
    const isDefaultRange = newValue[0] === 0 && newValue[1] === 5000;
    setFilters(prevFilters => ({
      ...prevFilters,
      priceFrom: isDefaultRange ? "" : newValue[0].toString(),
      priceTo: isDefaultRange ? "" : newValue[1].toString()
    }));
  };

  const handleAvailabilityChange = event => {
    const newAvailability = event.target.value;
    setFilters(prevFilters => ({
      ...prevFilters,
      availability: newAvailability
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      conditions: "",
      availability: "",
      search: ""
    });
    sellerPage !== true ? router.push("/market") : router.push(`/market/seller/${sellerId}`);
  };

  const handleRemoveFilter = filterKey => {
    if (filterKey === "priceRange") {
      setFilters(currentFilters => ({
        ...currentFilters,
        priceFrom: "0",
        priceTo: "5000"
      }));
    } else {
      setFilters(currentFilters => ({
        ...currentFilters,
        [filterKey]: ""
      }));
    }
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        sx={{
          m: { sm: 3 },
          mr: { xs: 3 },
          ml: { xs: 3 }
        }}>
        <Box
          display="flex"
          justifyContent="flex-end"
          sx={{
            mb: { xs: 0, sm: 2 },
            mr: { xs: 2, sm: 0 }
          }}>
          <Link variant="body2" onClick={clearFilters} sx={{ cursor: "pointer" }}>
            Reset Filters
          </Link>
        </Box>
        {areFiltersApplied ? (
          <>
            <Typography gutterBottom sx={{ mb: 1 }}>
              Applied filters
            </Typography>
            <Stack
              direction="row"
              alignItems="flex-start"
              flexWrap="wrap"
              spacing={1}
              sx={{ minHeight: "80px", mb: 1 }}>
              {Object.entries(filters).map(([key, value]) => {
                if (value && key !== "priceFrom" && key !== "priceTo") {
                  //excluding price range filters
                  return <Chip label={value.toLocaleLowerCase()} onDelete={() => handleRemoveFilter(key)} key={key} />;
                }
                return null;
              })}
              {(filters.priceFrom !== "0" || filters.priceTo !== "5000") &&
                (filters.priceFrom !== "" || filters.priceTo !== "") && (
                  <Chip
                    label={`Price: ${filters.priceFrom}-${filters.priceTo}`}
                    onDelete={() => handleRemoveFilter("priceRange")}
                    key="priceRange"
                  />
                )}
            </Stack>
          </>
        ) : (
          <Box sx={{ height: "1rem" }} />
        )}
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <RadioGroup
            row
            aria-label="availability"
            name="availability"
            value={filters.availability}
            onChange={handleAvailabilityChange}>
            <FormControlLabel value="available" control={<Radio />} label="Available" />
            <FormControlLabel value="sold" control={<Radio />} label="Sold" />
          </RadioGroup>
        </FormControl>
        <Typography id="range-slider" gutterBottom sx={{ mb: 2 }}>
          Price range
        </Typography>
        <Slider
          value={[Number(filters.priceFrom || 0), Number(filters.priceTo || 5000)]}
          onChange={handlePriceRangeChange}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          min={0}
          max={5000}
          step={50}
          sx={{ width: "100%", mb: 3 }}
        />
        <SelectComponent
          selectId="category"
          label="Category"
          options={categories}
          selectedValue={filters.category}
          onSelectionChange={handleFilterChange}
          sx={{ mb: 2 }}
        />
        {filters.category && (
          <SelectComponent
            selectId="conditions"
            label="Conditions"
            options={conditionsOptions}
            selectedValue={filters.conditions}
            onSelectionChange={handleFilterChange}
            sx={{ mb: 2 }}
          />
        )}
      </Box>
    </>
  );
};

export default Filter;
