import { adminClient, customerClient } from "./clients";

describe("Sessions API", () => {
    const testScreen = {
        name: "Test Screen",
        description: "Test Description",
        imageUrl: "https://test.com/image.jpg",
        type: "2D",
        capacity: 100,
        disability: true,
    };

    const testTicket = {
        type: "normal",
        used: 0,
        max_usage: 10,
    };

    const testMovie = {
        name: "Test Movie",
        duration: 120,
    };

    let testSession = {
        duration: 90,
        idMovie: 1,
        idScreen: 1,
        dateMovie: "2026-11-07T09:45:00Z",
    };

    let createdScreenId: string;
    let createdMovieId: string;
    let createdTicketId: string;
    let createdSessionId: string;

    beforeAll(async () => {
        const res1 = await adminClient.post("movies", testMovie);
        createdMovieId = res1.data.id;

        const res2 = await adminClient.post("screens", testScreen);
        createdScreenId = res2.data.id;

        const res3 = await adminClient.post("account/tickets", testTicket);
        createdTicketId = res3.data.id;

        testSession.idMovie = Number(createdMovieId)
        testSession.idScreen = Number(createdScreenId)
    });

    afterAll(async () => {
        try {
            await adminClient.delete(`screens/${createdScreenId}`);
        } catch (error) {}

        try {
            await adminClient.delete(`movies/${createdMovieId}`);
        } catch (error) {}

        try {
            await adminClient.delete(`sessions/${createdSessionId}`);
        } catch (error) {}
    });

    describe("POST /sessions/create", () => {
        it("should allow admin to create a session", async () => {
            const res = await adminClient.post("sessions/create", testSession);
            createdSessionId = res.data.id;
            
            const resData = {
                id: res.data.id,
                movie: res.data.movie,
                cinema: res.data.cinema,
                dateMovie: res.data.dateMovie,
                remaining_places: res.data.remaining_places,
            };

            expect(res.status).toBe(200);
            expect(resData).toMatchObject({
                id: expect.any(Number),
                movie: expect.any(Object),
                cinema: expect.any(Object),
                dateMovie: "2026-11-07T09:45:00.000Z", // Peut pas utilise testSession.date parce que y'a un 0Z en moins en input qu'en sortie
                remaining_places: 100,
            });
        });
    });

    describe("POST /sessions/:id/book", () => {
        it("should allow someone (connected) to book a session", async () => {
            let testSession2 = {
                duration: 90,
                idMovie: Number(createdMovieId),
                idScreen: Number(createdScreenId),
                dateMovie: "2026-11-08T09:45:00Z",
            };
            const resS = await adminClient.post("sessions/create", testSession2);
            const createdSessionId2 = resS.data.id;


            const dataToSend = {
                ticket_id_used: createdTicketId,
                nb_place_to_book: 1,
            };

            const res = await adminClient.post(
                `sessions/${createdSessionId2}/book`,
                dataToSend
            );

            // Extraction des données nécessaires
            const resData = { success: res.data };

            expect(res.status).toBe(200);
            expect(resData.success).toBe(true);

            await adminClient.delete(`sessions/${createdSessionId2}`)
        });
    });

    describe("GET /account", () => {
        it("should return account information including booked sessions", async () => {
            const dataToSend = {
                ticket_id_used: createdTicketId,
                nb_place_to_book: 1,
            };

            const res = await adminClient.post(
                `sessions/${createdSessionId}/book`,
                dataToSend
            );

            // Extraction des données nécessaires
            const resData = {
                movies: res.data.movies,
            };

            expect(res.status).toBe(200);
            expect(resData).toHaveProperty("movies");

            if (resData.movies && resData.movies.length > 0) {
                const movie = resData.movies[0];
                expect(movie).toMatchObject({
                    id: createdMovieId,
                    name: testMovie.name,
                    duration: testMovie.duration,
                });
            }
        });
    });
});
