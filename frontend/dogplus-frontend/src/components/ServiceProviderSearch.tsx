import { ServiceProvider } from "../types/serviceProvider";

interface ServiceProviderSearchProps {
    onSearchResults: (results: ServiceProvider[]) => void;
}

const ServiceProviderSearch: React.FC<ServiceProviderSearchProps> = ({ onSearchResults }) => {
    const handleSearch = async (query: string) => {

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/providers/service-providers/search/?query=`+ query,{
                method: "GET",
                headers: {
                  "Authorization": "Token "+ localStorage.getItem("token")
                },
              });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: ServiceProvider[] = await response.json();
            onSearchResults(data);
        } catch (error) {
            console.log(error);
            onSearchResults([]); 
        }
    };
  
    return (
      <div className="flex justify-center items-center p-2">
        <input type="text" 
        placeholder="Search..." 
        onChange={(e) => handleSearch(e.target.value)} 
        className="w-4/5 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
        />
      </div>
    );
  };

  export default ServiceProviderSearch;