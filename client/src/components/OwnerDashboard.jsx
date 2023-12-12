import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import OwnerHeader from "./OwnerHeader";
import Footer from "./Footer";
import { getAllChats } from "../api";
import ChatModal from "./ChatModal";

function OwnerDashboard() {
  const navigate = useNavigate();
  const [postedBooks, setPostedBooks] = useState([]);
  const [rentedBooks, setRentedBooks] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [openChatModal, setOpenChatModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    // Fetch posted books, rented books, and earnings data from the server
    // and update the corresponding state variables.
  }, []);
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

  const handlePostNewBook = () => {
    navigate("/PostBook");
  };

  return (
    <div>
      <OwnerHeader />
      <div className="dashboard-container">
        <div className="summary-section">
          <h2>Summary</h2>
          <p>Posted Books: {postedBooks.length}</p>
          <p>Rented Books: {rentedBooks.length}</p>
        </div>
        <div className="post-new-book-button">
          <button onClick={handlePostNewBook}>Post New Book</button>
        </div>
        <div className="rented-books-list">
          <h2>Rented Books</h2>
          <ul>
            {rentedBooks.map((book) => (
              <li key={book.id} className="rented-book-item">
                <p>Title: {book.title}</p>
                <p>Renter's Details: {book.renterDetails}</p>
                <p>Lender's Details: {book.lenderDetails}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="earnings-section">
          <h2>Earnings</h2>
          <p>Total Earnings: ${earnings}</p>
        </div>
      </div>
      <div className="admin-chat1">
        <card>
          <h1>Chats</h1>
          {chats && chats.length > 0 ? (
            chats.map(
              (chat) =>
                chat?.role !== "admin" && (
                  <div
                    className="chat-card"
                    onClick={() => {
                      setOpenChatModal(true);
                      setSelectedChat(chat);
                    }}
                    key={chat?._id}
                  >
                    <p>
                      {chat?.firstname}, {chat?.role}
                    </p>
                  </div>
                )
            )
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
        name="to renter"
      />
      <Footer />
    </div>
  );
}

export default OwnerDashboard;
