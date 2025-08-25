import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 text-center py-6 mt-auto">
      <p>&copy; {new Date().getFullYear()} TalentHub. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
