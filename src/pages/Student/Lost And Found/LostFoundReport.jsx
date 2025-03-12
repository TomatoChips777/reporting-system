import { useEffect, useState, memo } from "react";
import { useAuth } from "../../../../AuthContext";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaBoxOpen,
  FaClock,
  FaCheckCircle,
  FaChevronRight,
  FaPlusCircle,
  FaSearch,
  FaFilter,
  FaTimesCircle,
} from "react-icons/fa";
import CreateLostFoundModal from "../components/LostFoundModal";
import { io } from "socket.io-client";

const LostAndFoundReport = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [existingItem, setExistingItem] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchItems();
    const socketInstance = io("http://localhost:5000");
    setSocket(socketInstance);

    socketInstance.on("newItem", (newItem) => {
      setItems((prevItems) => [newItem, ...prevItems]);
    });

    socketInstance.on("itemUpdated", (data) => {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === Number(data.itemId) ? { ...item, status: data.status } : item
        )
      );
    });

    socketInstance.on("itemDeleted", (data) => {
      setItems((prevItems) => prevItems.filter((item) => item.id !== Number(data.itemId)));
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/lostandfound/user/items/${user.id}`
      );
      setItems(response.data.items);
    } catch (error) {
      alert("Error: Failed to fetch lost & found items.");
    }
    setLoading(false);
  };

  const totalItems = items.length;
  const openCount = items.filter((i) => i.status === "open").length;
  const claimedCount = items.filter((i) => i.status === "claimed").length;

  const filteredItems = items.filter((i) => {
    const matchesStatus = selectedStatus ? i.status === selectedStatus : true;
    const matchesSearch = searchQuery
      ? i.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.location.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const ItemCard = memo(({ item }) => (
    <div className="list-group-item list-group-item-action d-flex align-items-center mb-1">
      <FaBoxOpen className="me-3 text-primary flex-shrink-0" />
      <div className="flex-grow-1">
        <h5 className="mb-1">{item.item_name}</h5>
        <p className="mb-1">{item.location}</p>
        <small className="text-muted">{item.status}</small>
      </div>
      <FaChevronRight className="text-secondary flex-shrink-0" />
    </div>
  ));

  return (
    <div className="container mt-4">
      {/* Summary Cards */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="card p-3 text-center">
            <FaBoxOpen className="text-success mb-2" size={30} />
            <h6>Total Items</h6>
            <strong className="fs-1">{totalItems}</strong>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 text-center">
            <FaClock className="text-warning mb-2" size={30} />
            <h6>Open</h6>
            <strong className="fs-1">{openCount}</strong>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 text-center">
            <FaCheckCircle className="text-success mb-2" size={30} />
            <h6>Claimed</h6>
            <strong className="fs-1">{claimedCount}</strong>
          </div>
        </div>
      </div>

      {/* Header and Actions */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lost & Found</h2>
        <button className="btn btn-success" onClick={() => setShowModal(true)}>
          <FaPlusCircle className="me-1" /> Report Item
        </button>
      </div>

      {/* Search & Filter */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by item name or location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="btn btn-outline-secondary" onClick={handleClearSearch}>
                <FaTimesCircle />
              </button>
            )}
          </div>
        </div>
        <div className="col-md-3">
          <div className="input-group">
            <span className="input-group-text">
              <FaFilter />
            </span>
            <select
              className="form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="claimed">Claimed</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Item List */}
      <div className="list-group">
        {loading ? (
          <p>Loading items...</p>
        ) : currentItems.length > 0 ? (
          currentItems.map((item) => <ItemCard key={item.id} item={item} />)
        ) : (
          <p>No items found.</p>
        )}
      </div>

      {/* Pagination */}
      <nav className="mt-3">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
              Previous
            </button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
      <CreateLostFoundModal show={showModal} handleClose={() => setShowModal(false)} fetchItems={fetchItems} />
    </div>
  );
};

export default LostAndFoundReport;
