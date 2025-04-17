package com.example.financeservice.service;


import com.example.financeservice.entity.Depense;
import com.example.financeservice.entity.Facture;
import com.example.financeservice.entity.Project;
import com.example.financeservice.repository.FactureRepository;
import com.example.financeservice.repository.ProjectRepository;
import com.itextpdf.layout.properties.UnitValue;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.UUID;

@Service
public class FactureService {

    private final FactureRepository repository;
    private final ProjectRepository projectRepository;
    private DepenseService depenseService;

    public FactureService(FactureRepository repository, ProjectRepository projectRepository, DepenseService depenseService) {
        this.repository = repository;
        this.projectRepository = projectRepository;
        this.depenseService = depenseService;
    }

    public List<Facture> getAll() {
        return repository.findAll();
    }

    public Facture getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Facture save(Facture facture) {
        return repository.save(facture);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public byte[] generateInvoicePdf(Facture facture,Long id) throws IOException {

        Project project = projectRepository.findById(id).orElse(null);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        document.add(new Paragraph("Facture N°: " + facture.getNumFacture()));
        document.add(new Paragraph("Date: " + facture.getDateEmission()));
        document.add(new Paragraph("Projet: " + project.getNom()));

        Table table = new Table(UnitValue.createPercentArray(new float[]{4, 4, 4}));
        table.addHeaderCell("Description");
        table.addHeaderCell("Montant");
        table.addHeaderCell("Type");

        for (Depense depense : depenseService.getAll(id)) {
            table.addCell(depense.getDescription());
            table.addCell(depense.getMontant().toString());
            table.addCell(depense.getType().toString());
        }

        document.add(table);
        document.add(new Paragraph("Montant total: " + facture.getMontantTotal() + " TND"));

        document.close();
        return out.toByteArray();
    }


    @Transactional
    public Facture createFacture(Long projetId) throws Exception {
        Project projet = projectRepository.findById(projetId)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé"));

        List<Depense> depenses = depenseService.getAll(projetId);

        if (depenses.isEmpty()) {
            throw new RuntimeException("Aucune dépense trouvée pour ce projet");
        }

        Facture facture = new Facture();
        facture.setNumFacture("F-" + UUID.randomUUID().toString().substring(0, 8));
        facture.setDateEmission(new Date());
        facture.setProject(projet);
        facture.setMontantTotal(depenses.stream().mapToDouble(Depense::getMontant).sum());

        byte[] pdf = generateInvoicePdf(facture,projet.getIdproject());
        facture.setPdfData(pdf);

        return repository.save(facture);
    }


}

