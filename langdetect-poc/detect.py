from langdetect import detect
import csv

i = 0
with open('detected.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile, delimiter=',', quoting=csv.QUOTE_MINIMAL)
    with open('dataset.csv', newline='') as csvfile:
        lines = csv.reader(csvfile, delimiter=',', quotechar='"')
        next(lines)

        for row in lines:
            text = row[0]
            try:
                detected = detect(text)
            except Exception as e:
                print('Error line:', i, 'Text:', text)
                detected = 'null'
            truth = row[1]
            match = 'Y' if truth == detected else 'N'
            writer.writerow([truth, detected, match])

            i += 1
            print("*\n" if (i%1000==0 and i > 0) else '.', end='')




