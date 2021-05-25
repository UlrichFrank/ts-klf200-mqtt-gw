import { readFileSync } from "fs";
import { Connection, Products } from "klf-200-api";
import { ConfigKlf200 } from "./Config/ConfigKlf200";

export class Klf200Service {
    private static config : ConfigKlf200
    private static connection : Connection;

    public constructor(config: ConfigKlf200) {
        Klf200Service.config = config;
        this.registerOfflineHook();
    }

    private registerOfflineHook() {
        process.on('SIGTERM', Klf200Service.onUnload);        
    }

    public static async onLoad() {
        try {
            await Klf200Service.connection?.loginAsync(Klf200Service.config.getPassword());
        }  finally {
            await Klf200Service.connection?.logoutAsync();
        }     
    }
    public static async onUnload() {
        console.info('SIGTERM signal received.');
        try {
            await Klf200Service.connection?.logoutAsync();
        }  catch (error) {
        }    
    }

    public start() : Klf200Service {
        var ca : Buffer | undefined;
        try { 
            ca = readFileSync(Klf200Service.config?.getCert()?? 'velux-cert.pem')
        }
        catch(error) {
            console.log(error);
        }

        Klf200Service.connection = new Connection(Klf200Service.config?.getHost(), ca, Klf200Service.config?.fingerprint);

        return this;
    }
    
    public async setTargetPosition(productName : string, position : number) {
        const myProducts = await Products.createProductsAsync(Klf200Service.connection);
        myProducts.Products.forEach(element => console.log(element.Name));

        const product = myProducts.findByName(productName);
        if (product) {
            await product.setTargetPositionAsync(position);
        } else {
            throw(new Error("Could not find product ${productName}."));
        }
    }
}