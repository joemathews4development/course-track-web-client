import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'

type SearchProps = {
    placeholder: string,
    searchTerm: string,
    setSearchTerm: (value: string) => void
}

function SearchBar({ placeholder, searchTerm, setSearchTerm }: SearchProps) {
    return (
        <InputGroup className="mx-auto my-3">
            {/* Search Icon */}
            <InputGroup.Text>
                <i className="bi bi-search"></i>
            </InputGroup.Text>

            {/* Search Input Field */}
            <Form.Control
                type="search"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </InputGroup>
    )
}

export default SearchBar