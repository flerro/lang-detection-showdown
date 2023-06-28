package org.example;

import com.opencsv.*;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Function;

import com.github.pemistahl.lingua.api.*;
import static com.github.pemistahl.lingua.api.Language.*;


public class Main {


    public static void main(String[] args) {

        final LanguageDetector detector = LanguageDetectorBuilder.fromLanguages(
                ENGLISH,
                FRENCH,
                GERMAN,
                SPANISH,
                ITALIAN,
                PORTUGUESE,
                DANISH,
                DUTCH,
                ARABIC,
                GREEK,
                HINDI,
                RUSSIAN,
                MALAY,
                SWEDISH,
                TAMIL,
                TURKISH
        ).build();

        List<String[]> records = new ArrayList<>();
        try (FileReader fr = new FileReader("dataset_iso.csv");
             CSVReader csvReader = new CSVReader(fr)) {

            String[] values;
            int i = 0;
            while ((values = csvReader.readNext()) != null) {
                String text = values[0];
                String groundTruth = values[1];

                Language detectedLanguage = detector.detectLanguageOf(text);
                String lang = detectedLanguage.getIsoCode639_1().toString();
                boolean match = groundTruth.equals(lang);

                records.add(new String[]{groundTruth, lang, match ? "Y" : "N"});

                System.out.print((i%1000 == 0 && i > 0) ? "*\n" : '.' );
                i++;
            }

            CSVWriter csvWriter = new CSVWriter(new FileWriter("detected.csv"), ',');
            csvWriter.writeAll(records);
            csvWriter.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }




}