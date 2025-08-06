import { neon } from "@neondatabase/serverless";
import { Request, Response } from 'express';

export const signUpHandler = (() => {
    /**
     * Sign Up Page | POST
     * @param req
     * @param resp
     */
    const post = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const { email, name, distance, gender, birth, team, paid } = req.body.data || req.body;
        if (!process.env.DATABASE_URL) {
            res.status(500).send("No DATABASE_URL environment variable");
            return;
        }
        try {
            const sql = neon(process.env.DATABASE_URL);
            const updateResult = await sql`
                INSERT INTO public.registered (email, name, distance, gender, birth, team, paid) 
                    VALUES (${email}, ${name}, ${distance}, ${gender}, ${birth}, ${team}, ${paid})
            `;
            const registered = await sql`SELECT name FROM registered;`;
            res.status(200).send(registered);
        } catch (error) {
            if (
                typeof error === "object" &&
                error !== null &&
                "code" in error &&
                (error as { code?: string }).code === "23505"
            ) {
                res.status(409).send({ error: JSON.stringify((error as { code?: string }).code) || "Unknown error" });
            } else {
                res.status(500).send({ error: error instanceof Error ? error.message : String(error) });
            }
        }
    }
    return {
        post,
    }
})();