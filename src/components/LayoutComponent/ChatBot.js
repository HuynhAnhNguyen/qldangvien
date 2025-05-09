import React, { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../../services/apiService";

const ChatBot = () => {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    const userMessage = { text: message, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    try {
      const data = await sendChatMessage(message);
      //   console.log(token);
      //   console.log(message);
      //   console.log(data);
      const botMessage = { text: data.response, sender: "bot" }; // lấy "reply" từ data
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage = {
        text: "Xin lỗi, tôi không thể kết nối ngay lúc này.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      // setMessage("");
    }
  };

  return (
    <>
      {/* Chatbot Widget */}
      <div
        className={`position-fixed bottom-0 end-0 mb-4 me-4 ${
          chatbotOpen ? "" : "d-none"
        }`}
        style={{ width: "350px", zIndex: 1000 }}
      >
        <div className="card shadow-lg">
          <div
            className="card-header bg-primary text-white d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
            onClick={() => setChatbotOpen(false)}
          >
            <span>Trợ lý ảo</span>
            <i className="fas fa-times"></i>
          </div>
          <div
            className="card-body p-0"
            style={{ height: "300px", overflowY: "auto" }}
          >
            <div className="p-3">
              {messages.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <i className="fas fa-robot fa-3x mb-3"></i>
                  <p>Xin chào! Tôi có thể giúp gì cho bạn?</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`d-flex mb-3 ${
                      msg.sender === "user"
                        ? "justify-content-end"
                        : "justify-content-start"
                    }`}
                  >
                    <div
                      className={`d-flex flex-column ${
                        msg.sender === "user"
                          ? "align-items-end"
                          : "align-items-start"
                      }`}
                      style={{ maxWidth: "80%" }}
                    >
                      {msg.sender === "bot" && (
                        <small className="text-muted mb-1">Trợ lý ảo</small>
                      )}
                      <div
                        className={`p-3 rounded ${
                          msg.sender === "user"
                            ? "bg-primary text-white"
                            : "bg-light text-dark"
                        }`}
                        style={{
                          borderRadius:
                            msg.sender === "user"
                              ? "18px 18px 0 18px"
                              : "18px 18px 18px 0",
                          wordWrap: "break-word",
                        }}
                      >
                        {msg.text}
                      </div>
                      {msg.sender === "user" && (
                        <small className="text-muted mt-1">Bạn</small>
                      )}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="d-flex justify-content-start">
                  <div
                    className="d-flex flex-column align-items-start"
                    style={{ maxWidth: "80%" }}
                  >
                    <small className="text-muted mb-1">Trợ lý ảo</small>
                    <div
                      className="p-3 rounded bg-light text-dark"
                      style={{ borderRadius: "18px 18px 18px 0" }}
                    >
                      <i className="fas fa-circle-notch fa-spin me-2"></i> Đang
                      soạn câu trả lời...
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="card-footer">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Nhập tin nhắn..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                className="btn btn-primary"
                onClick={sendMessage}
                disabled={loading}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nút mở chatbot */}
      {!chatbotOpen && (
        <button
          className="btn btn-primary position-fixed rounded-circle"
          style={{
            width: "60px",
            height: "60px",
            bottom: "20px",
            right: "20px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          }}
          onClick={() => setChatbotOpen(true)}
        >
          <i className="fas fa-robot fa-lg"></i>
        </button>
      )}
    </>
  );
};

export default ChatBot;
