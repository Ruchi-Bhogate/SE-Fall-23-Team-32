import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AdminOrdersPage.css";
import { getAllChats } from "../api";
import ChatModal from "./ChatModal";

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("pending");
  const [openChatModal, setOpenChatModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  const handleOrderUpdate = async (orderId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/admin/orders/${orderId}`,
        { status }
      );
      if (response.status === 200) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/admin/orders?status=${filter}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const [chats, setChats] = useState([]);
  useEffect(() => {
    const loadChats = async () => {
      try {
        const response = await getAllChats();
        setChats(response);
      } catch (error) {
        console.error("Could not load chats", error);
      }
    };
    loadChats();
  }, []);
  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="admin-orders">
        <h1>Admin Orders Management</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="declined">Declined</option>
        </select>
        <ul>
          {orders.map((order) => (
            <li key={order._id} onClick={() => handleOrderSelect(order)}>
              <div>Order ID: {order._id}</div>
              <div>User ID: {order.userId}</div>
              <div>Total Amount: ${order.amount}</div>
              {order.status === "pending" && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOrderUpdate(order._id, "approved");
                    }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOrderUpdate(order._id, "declined");
                    }}
                  >
                    Decline
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>

        {isModalOpen && (
          <OrderDetailsModal order={selectedOrder} onClose={closeModal} />
        )}
      </div>
      <div className="admin-chat">
        <card >
          <h1>Chats</h1>
          {chats && chats.length > 0 ? (
            chats.map((chat) => (
              <div
              className="chat-card"
                onClick={() => {
                  setOpenChatModal(true);
                  setSelectedChat(chat);
                }}
                key={chat?._id}
              >
                <p>{chat?.firstname}, {chat?.role}</p>

              </div>
            ))
          ) : (
            <p>No chats</p>
          )}
        </card>
      </div>
      <ChatModal
        isModalOpen={openChatModal}
        setModalOpen={setOpenChatModal}
        withId={selectedChat?._id}
        withType={selectedChat?.role}
        title={selectedChat?.firstname}
      />
    </>
  );
}

function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2>Order Details:</h2>
        {/* Render the details of the selected order */}
        <p>Order ID: {order._id}</p>
        <p>Status: {order.status}</p>
        <ul>
          {order.cartItems.map((item, index) => (
            <li key={index}>
              <p>itemID:{item._id}</p>
              <p>{item.title}</p>
              <p>Days: {item.days}</p>
              <p>Price per day: ${item.price_per_day}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminOrdersPage;
