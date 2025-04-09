// This is a helper script to set the admin token directly in localStorage
// You can run this in your browser console if you can't access the login page

function setAdminToken() {
  // Create a mock JWT token (this is just for development/testing)
  const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYXJjdXMiLCJuYW1lIjoiTWFyY3VzIChCaWtlIFNob3AgT3duZXIpIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjE2MTUxOTM1LCJleHAiOjE2NDc2ODc5MzV9.7MjSO_RFe9ozgTYgbpyIFfgQaeG2_0tvDgfIVt7XFEM";
  
  // Set the token in localStorage
  localStorage.setItem('adminToken', mockToken);
  
  // Check if it was set correctly
  const token = localStorage.getItem('adminToken');
  if (token) {
    console.log("✅ Admin token set successfully!");
    console.log("You should now be able to see the Admin tab in the navigation.");
    console.log("If not, try refreshing the page.");
    console.log("You can navigate to /admin to access the admin panel.");
  } else {
    console.error("❌ Failed to set admin token.");
  }
}

// Execute the function
setAdminToken();

// Instructions for use:
// 1. Open your browser console (F12 or right-click > Inspect > Console)
// 2. Copy and paste this entire script into the console
// 3. Press Enter to run it
// 4. Refresh the page, and you should see the Admin tab in the navigation

// To remove the token later:
// localStorage.removeItem('adminToken'); 