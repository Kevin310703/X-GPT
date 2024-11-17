import React from "react";

const UpdatesFAQ = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Updates & FAQ</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Latest Updates</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Version 1.2.0</strong>: Added Stable Diffusion AI image generation and improved UI performance.
          </li>
          <li>
            <strong>Version 1.1.0</strong>: Introduced chat session grouping and improved API performance.
          </li>
          <li>
            <strong>Version 1.0.0</strong>: Initial release with basic chat and model features.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-800">Q: How do I create a new chat?</h3>
            <p className="text-gray-600">A: Click on the "New Chat" button in the sidebar to start a new session.</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800">Q: How can I delete a chat session?</h3>
            <p className="text-gray-600">
              A: Use the trash icon in the sidebar to clear all chat sessions. You cannot delete individual sessions yet.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800">Q: Is my data secure?</h3>
            <p className="text-gray-600">
              A: Yes, all your chat data is securely stored and only accessible to you.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UpdatesFAQ;