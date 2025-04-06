export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-6">About Marcus Bikes</h1>
        
        <div className="prose prose-blue max-w-none">
          <p className="lead text-lg text-gray-700 mb-6">
            Marcus Bikes is a premium bicycle shop specializing in fully customizable bicycles 
            and other sports equipment to meet the specific needs of each customer.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 mt-8">Our Story</h2>
          <p>
            Founded by Marcus in 2015, our shop began as a small repair service but quickly 
            grew into a full-scale customization workshop. What makes our business unique is 
            our commitment to personalization - we believe that every rider deserves equipment 
            that perfectly matches their style, comfort needs, and performance expectations.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 mt-8">Our Approach</h2>
          <p>
            We take pride in our meticulous approach to customization. Every component is 
            carefully selected and tested for compatibility, ensuring that your custom bicycle 
            not only looks great but performs exceptionally well. Our expert team will guide 
            you through the customization process, helping you make informed decisions about 
            each component.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 mt-8">Quality Commitment</h2>
          <p>
            We source our components from trusted manufacturers and thoroughly test each 
            finished product before it reaches the customer. Our guarantee covers both the 
            individual components and how they work together as a complete system.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 mt-8">Future Vision</h2>
          <p>
            As we continue to grow, we&apos;re expanding our product range to include other 
            customizable sports equipment such as skis, surfboards, and roller skates. 
            Our goal is to become your one-stop shop for all personalized sports gear.
          </p>
          
          <div className="bg-blue-50 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold mb-2">Visit Our Workshop</h3>
            <p className="mb-4">
              We welcome you to visit our physical workshop to see our craftsmanship firsthand 
              and discuss your custom requirements in person.
            </p>
            <address className="not-italic">
              <strong>Address:</strong><br />
              123 Bicycle Lane<br />
              Sportsville, SP 12345<br /><br />
              <strong>Hours:</strong><br />
              Monday - Friday: 9am - 6pm<br />
              Saturday: 10am - 4pm<br />
              Sunday: Closed
            </address>
          </div>
        </div>
      </div>
    </div>
  );
} 