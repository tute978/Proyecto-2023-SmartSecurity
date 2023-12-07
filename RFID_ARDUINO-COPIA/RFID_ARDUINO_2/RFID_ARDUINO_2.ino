// LISTA DE REPRODUCCION - ESP32 - ESP8266
// https://www.youtube.com/playlist?list=PLZHVfZzF2DYID9jGK8EpcMni-U2CSTrw3

// LISTA DE REPRODCUION DEL CURSO DE ARDUINO DESDE CERO
// https://www.youtube.com/playlist?list=PLZHVfZzF2DYJeLXXxz6YtpBj4u7FoGPWN

#define RELAY 21 // Pin del Relay
#include <SPI.h>
#include <MFRC522.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_Fingerprint.h>
#if defined(ESP32)
  #define SS_PIN 5
  #define RST_PIN 22
#endif

const char *ssid = "SmartSecurity";
const char *password = "hardware";
const char *Email = "simonescolar@gmail.com";
const int serverPort = 3000; 
const char *serverAddress = "192.168.163.67";

MFRC522 rfid(SS_PIN, RST_PIN); // Instance of the class
MFRC522::MIFARE_Key key;
// Init array that will store new NUID
byte nuidPICC[4];

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
String DatoHex;
const String UserReg_1 = "33C53E17";
const String UserReg_2 = "3230C710";
const String UserReg_3 = "8D08718B";
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

String printHex(byte *buffer, byte bufferSize)
{  
   String DatoHexAux = "";
   for (byte i = 0; i < bufferSize; i++) 
   {
       if (buffer[i] < 0x10)
       {
        DatoHexAux = DatoHexAux + "0";
        DatoHexAux = DatoHexAux + String(buffer[i], HEX);  
       }
       else { DatoHexAux = DatoHexAux + String(buffer[i], HEX); }
   }
   
   for (int i = 0; i < DatoHexAux.length(); i++) {DatoHexAux[i] = toupper(DatoHexAux[i]);}
   return DatoHexAux;
}
//Fingerprint:
#if (defined(AVR) || defined(ESP8266)) && !defined(AVR_ATmega2560)

SoftwareSerial mySerial(16, 17);

#else

#define mySerial Serial2

#endif


Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);
int fingerprintID = 0;
String IDname;

//Hasta aca


void setup() 
{
   Serial.begin(115200);
   SPI.begin(); // Init SPI bus
   rfid.PCD_Init(); // Init MFRC522
   pinMode(RELAY, OUTPUT);  // Configura el pin RELAY como salida
   digitalWrite(RELAY, LOW);  // Inicialmente, apaga el relé
   Serial.println("Ponga su Tarjeta para la lectura...");  // Muestra un mensaje en la consola
   Serial.println();
   Serial.println();
   Serial.print(F("Reader :"));
   rfid.PCD_DumpVersionToSerial();
   for (byte i = 0; i < 6; i++) {
     key.keyByte[i] = 0xFF;
   }
   DatoHex = printHex(key.keyByte, MFRC522::MF_KEY_SIZE);
   Serial.println();


    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      delay(1000);
      Serial.println("Connecting to WiFi...");
    }
    Serial.println("WiFi connected");
  
    // Mensaje de configuración del servidor HTTP
    Serial.println("Configuring HTTP server...");

    //Fingerprint:
    
    while (!Serial);  // For Yun/Leo/Micro/Zero/...
    delay(100);
    Serial.println("\n\nAdafruit finger detect test");
  
    // set the data rate for the sensor serial port
    finger.begin(57600);
    delay(5);
    if (finger.verifyPassword()) {
      Serial.println("Found fingerprint sensor!");
    } else {
      Serial.println("Did not find fingerprint sensor :(");
      while (1) { delay(1); }
    }
  
    Serial.println(F("Reading sensor parameters"));
    finger.getParameters();
    Serial.print(F("Status: 0x")); Serial.println(finger.status_reg, HEX);
    Serial.print(F("Sys ID: 0x")); Serial.println(finger.system_id, HEX);
    Serial.print(F("Capacity: ")); Serial.println(finger.capacity);
    Serial.print(F("Security level: ")); Serial.println(finger.security_level);
    Serial.print(F("Device address: ")); Serial.println(finger.device_addr, HEX);
    Serial.print(F("Packet len: ")); Serial.println(finger.packet_len);
    Serial.print(F("Baud rate: ")); Serial.println(finger.baud_rate);
  
    finger.getTemplateCount();
  
    if (finger.templateCount == 0) {
      Serial.print("Sensor doesn't contain any fingerprint data. Please run the 'enroll' example.");
    }
    else {
      Serial.println("Waiting for valid finger...");
        Serial.print("Sensor contains "); Serial.print(finger.templateCount); Serial.println(" templates");
    }

  //Hasta acá
}

void loop() 
{    
     // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
     if (!rfid.PICC_IsNewCardPresent() && finger.getImage() != FINGERPRINT_OK){return;}
     Serial.println("hola");
     // Verify if the NUID has been readed
     if (rfid.PICC_ReadCardSerial()){

       Serial.println("Se ha detectado una nueva tarjeta.");
       
       // Store NUID into nuidPICC array
       for (byte i = 0; i < 4; i++) {nuidPICC[i] = rfid.uid.uidByte[i];}
    
       DatoHex = printHex(rfid.uid.uidByte, rfid.uid.size);
       Serial.print("Codigo Tarjeta: "); Serial.println(DatoHex);
     
       //if (rfid.uid.uidByte[0] != nuidPICC[0] || rfid.uid.uidByte[1] != nuidPICC[1] || rfid.uid.uidByte[2] != nuidPICC[2] || rfid.uid.uidByte[3] != nuidPICC[3] ){}
       // Halt PICC
       rfid.PICC_HaltA();
       // Stop encryption on PCD
       rfid.PCD_StopCrypto1();
     }

     if(getFingerprintIDez() != -1){
      DatoHex = getFingerprintID();
     }
     Serial.println(DatoHex);

    //---------------------------------------------------------------------------------------

    StaticJsonDocument<200> jsonDocument;
    jsonDocument["ownerEmail"] = Email;
    jsonDocument["idCard"] = DatoHex;

    // Serialización del documento JSON en una cadena
    
    String jsonData;
    serializeJson(jsonDocument, jsonData);
    
    HTTPClient http;
    WiFiClient client;
    http.begin(client, "http://" + String(serverAddress) + ":" + String(serverPort) + "/hist/register/create");
    http.addHeader("Content-Type", "application/json"); // Establecimiento de la cabecera de tipo de contenido

    // Envío de la cadena JSON al servidor mediante una solicitud POST
    int httpCode = http.POST(jsonData);

    if (httpCode == HTTP_CODE_OK) {
      // Lectura de la respuesta del servidor (si es necesario)
      String response = http.getString();
       Serial.println("Server Response:");
       Serial.println(response);
       
        digitalWrite(RELAY, HIGH);  // Activa el relé
        delay(3000);
        digitalWrite(RELAY, LOW); 
    } else {
      // Manejo de errores de conexión HTTP (si es necesario)
       Serial.print("HTTP Connection Error: ");
       Serial.println(httpCode);
    }

    // Finalización de la comunicación HTTP
    http.end(); 
}


//Fingerprint

uint8_t getFingerprintID() {
  uint8_t p = finger.getImage();
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.println("No finger detected");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }

  // OK success!

  p = finger.image2Tz();
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("Image too messy");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }

  // OK converted!
  p = finger.fingerSearch();
  if (p == FINGERPRINT_OK) {
    Serial.println("Found a print match!");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_NOTFOUND) {
    Serial.println("Did not find a match");
    return p;
  } else {
    Serial.println("Unknown error");
    return p;
  }

  // found a match!
  Serial.print("Found ID #"); Serial.print(finger.fingerID);
  Serial.print(" with confidence of "); Serial.println(finger.confidence);

  return finger.fingerID;
}

// returns -1 if failed, otherwise returns ID #
int getFingerprintIDez() {
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK)  return -1;

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK)  return -1;

  p = finger.fingerFastSearch();
  if (p != FINGERPRINT_OK)  return -1;

  // found a match!
  Serial.print("Found ID #"); Serial.print(finger.fingerID);
  Serial.print(" with confidence of "); Serial.println(finger.confidence);
  return finger.fingerID;
}

//Hasta acá

/* ESP 8266 NODE MCU
  Vcc <-> 3V3 (o Vin(5V) según la versión del módulo)
  RST (Reset) <-> D0
  GND (Tierra) <-> GND
  MISO (Master Input Slave Output) <-> D6
  MOSI (Master Output Slave Input) <-> D7
  SCK (Serial Clock) <-> D5 
  SS/SDA (Slave select) <-> D8
*/

/* ESP 32 NODE MCU
  Vcc <-> 3V3 (o Vin(5V) según la versión del módulo)
  RST (Reset) <-> D22
  GND (Masse) <-> GND
  MISO (Master Input Slave Output) <-> 19
  MOSI (Master Output Slave Input) <-> 23
  SCK (Serial Clock) <-> 18
  SS/SDA (Slave select) <-> 5
*/
