import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useEscapeKey from "../../hooks/useEscapeKey";
import useSearchSuggestions from "../../hooks/useSearchSuggestions";
import Loading from "../ui/Loading";
import Input from "../ui/Input";

const SearchBar = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const { suggestions, isLoading, isEmpty } = useSearchSuggestions(searchQuery);

  useEscapeKey(() => setShowSuggestions(false));

  const handleSelectSuggestion = (suggestion) => {
    setSearchQuery("");
    setShowSuggestions(false);
    if (onClose) onClose();

    if (suggestion.type === "Category") {
      const slug = suggestion.label.toLowerCase().replace(/\s+/g, "-");
      navigate(`/category/${suggestion.slug}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(suggestion.label)}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
    setShowSuggestions(false);
    if (onClose) onClose();
  };

  return (
    <div className="flex-1 max-w-xl lg:mr-8 relative">
      <form onSubmit={handleSearchSubmit} role="search">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for products, brands and more..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            aria-label="Search products"
            aria-expanded={showSuggestions && suggestions.length > 0}
            aria-controls="search-suggestions"
            aria-autocomplete="list"
            autoComplete="off"
            leftIcon={Search}
          />
        </div>
      </form>

      {showSuggestions && (isLoading || isEmpty || suggestions.length > 0) && (
        <div
          id="search-suggestions"
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10
         max-h-[300px] overflow-y-auto"
          role="listbox"
          aria-label="Search suggestions"
        >
          {isLoading ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              <Loading />
            </div>
          ) : isEmpty ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              No suggestions found
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50"
                onMouseDown={() => handleSelectSuggestion(suggestion)}
                role="option"
                aria-selected="false"
              >
                <Search
                  className="w-4 h-4 inline mr-2 text-gray-400"
                  aria-hidden="true"
                />
                <span>{suggestion.label}</span>
                {suggestion.type === "Category" && (
                  <span className="ml-2 text-xs text-gray-400">
                    ({suggestion.type})
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
