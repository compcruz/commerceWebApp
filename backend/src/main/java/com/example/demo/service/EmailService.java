package com.example.demo.service;

import com.example.demo.model.Order;
import com.example.demo.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


import java.nio.charset.StandardCharsets;
import jakarta.mail.internet.MimeMessage;
import java.util.stream.Collectors;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendOrderConfirmation(String to, Order order) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setCc("1986ankush.sharma@gmail.com"); // CC admin
            helper.setSubject("Order Confirmation - Order #" + order.getId());
            helper.setText(buildHtmlBody(order), true);
            // Attach PDF invoice
            byte[] pdfBytes = generateInvoicePdf(order);
            helper.addAttachment("invoice-order-" + order.getId() + ".pdf", new org.springframework.core.io.ByteArrayResource(pdfBytes));
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Generate a PDF invoice using OpenPDF
    private byte[] generateInvoicePdf(Order order) throws Exception {
        com.lowagie.text.Document document = new com.lowagie.text.Document();
        java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
        com.lowagie.text.pdf.PdfWriter.getInstance(document, baos);
        document.open();
        document.addTitle("Order Invoice");
        com.lowagie.text.Font titleFont = new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA, 18, com.lowagie.text.Font.BOLD, new java.awt.Color(241,100,30));
        document.add(new com.lowagie.text.Paragraph("Order Invoice", titleFont));
        document.add(new com.lowagie.text.Paragraph("Order ID: " + order.getId()));
        document.add(new com.lowagie.text.Paragraph("Order Date: " + order.getOrderDate()));
        document.add(new com.lowagie.text.Paragraph(" "));
        document.add(new com.lowagie.text.Paragraph("Delivery Address:"));
        document.add(new com.lowagie.text.Paragraph(order.getName()));
        document.add(new com.lowagie.text.Paragraph(order.getStreet()));
        document.add(new com.lowagie.text.Paragraph(order.getCity() + ", " + order.getState() + " " + order.getZip() + ", " + order.getCountry()));
        document.add(new com.lowagie.text.Paragraph(" "));
        // Items table
        com.lowagie.text.pdf.PdfPTable table = new com.lowagie.text.pdf.PdfPTable(4);
        table.setWidthPercentage(100);
        table.addCell("Product");
        table.addCell("Qty");
        table.addCell("Unit Price");
        table.addCell("Total");
        double total = 0;
        java.util.Map<Long, Long> productCounts = new java.util.HashMap<>();
        for (com.example.demo.model.Product p : order.getProducts()) {
            productCounts.put(p.getId(), productCounts.getOrDefault(p.getId(), 0L) + 1);
        }
        java.util.Set<Long> processed = new java.util.HashSet<>();
        for (com.example.demo.model.Product p : order.getProducts()) {
            if (processed.contains(p.getId())) continue;
            long qty = productCounts.get(p.getId());
            double subtotal = p.getPrice() * qty;
            table.addCell(p.getName());
            table.addCell(String.valueOf(qty));
            table.addCell("$" + String.format("%.2f", p.getPrice()));
            table.addCell("$" + String.format("%.2f", subtotal));
            total += subtotal;
            processed.add(p.getId());
        }
        document.add(table);
        document.add(new com.lowagie.text.Paragraph(" "));
        com.lowagie.text.Font totalFont = new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA, 14, com.lowagie.text.Font.BOLD);
        document.add(new com.lowagie.text.Paragraph("Total: $" + String.format("%.2f", total), totalFont));
        document.close();
        return baos.toByteArray();
    }

    private String buildHtmlBody(Order order) {
        StringBuilder sb = new StringBuilder();
        sb.append("<div style='font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #eee;border-radius:8px;'>");
        sb.append("<h2 style='color:#f1641e'>Thank you for your order!</h2>");
        sb.append("<p><b>Order ID:</b> ").append(order.getId()).append("<br>");
        sb.append("<b>Order Date:</b> ").append(order.getOrderDate()).append("</p>");
        sb.append("<h3>Delivery Address</h3>");
        sb.append("<p>")
          .append(order.getName()).append("<br>")
          .append(order.getStreet()).append("<br>")
          .append(order.getCity()).append(", ")
          .append(order.getState()).append(" ")
          .append(order.getZip()).append("<br>")
          .append(order.getCountry()).append("</p>");
        sb.append("<h3>Items</h3><table style='width:100%;border-collapse:collapse;'>");
        sb.append("<tr><th align='left'>Product</th><th align='right'>Qty</th><th align='right'>Unit Price</th><th align='right'>Total</th></tr>");
        double total = 0;
        for (Product p : order.getProducts()) {
            long qty = order.getProducts().stream().filter(x -> x.getId().equals(p.getId())).count();
            double subtotal = p.getPrice() * qty;
            sb.append("<tr><td>").append(p.getName()).append("</td><td align='right'>").append(qty)
              .append("</td><td align='right'>$ ").append(String.format("%.2f", p.getPrice()))
              .append("</td><td align='right'>$ ").append(String.format("%.2f", subtotal)).append("</td></tr>");
            total += subtotal;
        }
        sb.append("</table>");
        sb.append("<h3 style='text-align:right'>Total: $" + String.format("%.2f", total) + "</h3>");
        sb.append("<p style='color:#888;font-size:13px'>If you have any questions, reply to this email.</p>");
        sb.append("</div>");
        return sb.toString();
    }
}
