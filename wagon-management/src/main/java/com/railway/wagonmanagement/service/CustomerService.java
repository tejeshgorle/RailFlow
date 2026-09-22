package com.railway.wagonmanagement.service;

import com.railway.wagonmanagement.exception.CustomerNotFoundException;
import com.railway.wagonmanagement.exception.InvalidCustomerException;
import com.railway.wagonmanagement.model.Customer;
import com.railway.wagonmanagement.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    // =========================================================
    // CREATE CUSTOMER
    // =========================================================

    public Customer createCustomer(Customer customer) {

        // -------------------------------------------------
        // 1. Customer object validation
        // -------------------------------------------------

        if (customer == null) {

            throw new InvalidCustomerException(
                    "Customer information is required");
        }

        // -------------------------------------------------
        // 2. Customer name validation
        // -------------------------------------------------

        if (customer.getCustomerName() == null ||
                customer.getCustomerName().trim().isEmpty()) {

            throw new InvalidCustomerException(
                    "Customer name is required");
        }

        String customerName =
                customer.getCustomerName().trim();

        // -------------------------------------------------
        // 3. Customer name length validation
        // -------------------------------------------------

        if (customerName.length() < 2 ||
                customerName.length() > 100) {

            throw new InvalidCustomerException(
                    "Customer name must be between 2 and 100 characters");
        }

        // -------------------------------------------------
        // 4. Customer type validation
        // -------------------------------------------------

        if (customer.getCustomerType() == null ||
                customer.getCustomerType().trim().isEmpty()) {

            throw new InvalidCustomerException(
                    "Customer type is required");
        }

        String customerType =
                customer.getCustomerType().trim();

        // -------------------------------------------------
        // 5. Customer type length validation
        // -------------------------------------------------

        if (customerType.length() > 50) {

            throw new InvalidCustomerException(
                    "Customer type cannot exceed 50 characters");
        }

        // -------------------------------------------------
        // 6. Contact number validation
        // -------------------------------------------------

        if (customer.getContactNumber() != null &&
                !customer.getContactNumber().trim().isEmpty()) {

            String contactNumber =
                    customer.getContactNumber().trim();

            if (!contactNumber.matches("\\d{10}")) {

                throw new InvalidCustomerException(
                        "Contact number must contain exactly 10 digits");
            }
        }

        // -------------------------------------------------
        // 7. Address validation
        // -------------------------------------------------

        if (customer.getAddress() != null) {

            String address =
                    customer.getAddress().trim();

            if (address.length() > 250) {

                throw new InvalidCustomerException(
                        "Address cannot exceed 250 characters");
            }
        }

        // -------------------------------------------------
        // 8. Duplicate customer validation
        // -------------------------------------------------

        if (customerRepository.existsByCustomerNameIgnoreCase(
                customerName)) {

            throw new InvalidCustomerException(
                    "Customer already exists with name: "
                            + customerName);
        }

        // -------------------------------------------------
        // 9. Store cleaned values
        // -------------------------------------------------

        customer.setCustomerName(customerName);
        customer.setCustomerType(customerType);

        if (customer.getContactNumber() != null) {

            customer.setContactNumber(
                    customer.getContactNumber().trim());
        }

        if (customer.getAddress() != null) {

            customer.setAddress(
                    customer.getAddress().trim());
        }

        // -------------------------------------------------
        // 10. Save customer
        // -------------------------------------------------

        return customerRepository.save(customer);
    }

    // =========================================================
    // GET ALL CUSTOMERS
    // =========================================================

    public List<Customer> getAllCustomers() {

        return customerRepository.findAll();
    }

    // =========================================================
    // GET CUSTOMER BY ID
    // =========================================================

    public Customer getCustomerById(Long id) {

        return customerRepository.findById(id)
                .orElseThrow(() ->
                        new CustomerNotFoundException(
                                "Customer not found with id: " + id
                        )
                );
    }
}