- Product/bike components
    - A validation checking any product/bike has a minimum standard of components could have been implemented.

- Customer view
    - On the categories panel, we could have provided some filters despite of not being necessary yet
    - On the products panel, filters by name, price, components... would be great. This is a key reason to have a better product/component/option structure tough the current structure should allow it.
    - Cart management: When a new product is added to the cart we are not interacting with the database to block/book the quantity in the inventory

- Admin view/panel
    - A dummy login has been provided, whereas we could have used a third party like Firebase to reduce the complexity and leverage on a consolidated tool that has enough robustness 
    - We are missing a components panel to handle them and their options properly, this would help standardizing the components so multiple products could share a component
    - Options (Part choices) same as components, also they should be linked to the inventory. When updating the inventory it will update the option stock, but further linking is missing, for instance creating an option won't generate the matching inventory record
    - The inventory panel should allow filtering by product/component to provide more granularity and improve the UX of the user
    - Orders management, further features like cancelling a pending order or quick actions to easily contact the customer would enrich the app 

- Catering API calls on the frontend
    - An internal API on the frontend was started at 'marcus-bikes-frontend/src/app/lib/api.ts', but most of the frontend is not using it. This would be done in a next iteration to keep code clean and improve maintainability