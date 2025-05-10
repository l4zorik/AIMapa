// Služba pro práci s geolokací
class GeolocationService {
  private watchId: number | null = null;
  private lastPosition: GeolocationPosition | null = null;
  private positionListeners: ((position: GeolocationPosition) => void)[] = [];

  constructor() {
    // Automaticky začít sledovat polohu při vytvoření instance
    this.startWatching();
  }

  // Získání aktuální polohy
  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      // Vždy se pokusíme získat aktuální polohu, i když máme uloženou poslední polohu
      if (!navigator.geolocation) {
        reject(new Error('Geolokace není podporována vaším prohlížečem.'));
        return;
      }

      // Pokud máme uloženou poslední polohu, vrátíme ji okamžitě
      if (this.lastPosition) {
        console.log('Vracím poslední známou polohu:', this.lastPosition);
        resolve(this.lastPosition);

        // Ale zároveň se pokusíme získat aktuální polohu na pozadí
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('Aktualizuji poslední polohu na pozadí:', position);
            this.lastPosition = position;

            // Vyvoláme událost pro informování ostatních komponent
            const event = new CustomEvent('userLocationUpdated', {
              detail: {
                position: position,
                latLng: this.positionToLatLng(position),
                location: this.positionToLocation(position)
              }
            });
            window.dispatchEvent(event);
          },
          (error) => {
            console.warn('Nepodařilo se aktualizovat polohu na pozadí:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
        return;
      }

      // Pokud nemáme poslední polohu, získáme ji
      console.log('Získávám aktuální polohu...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Získána aktuální poloha:', position);
          this.lastPosition = position;
          resolve(position);

          // Vyvoláme událost pro informování ostatních komponent
          const event = new CustomEvent('userLocationUpdated', {
            detail: {
              position: position,
              latLng: this.positionToLatLng(position),
              location: this.positionToLocation(position)
            }
          });
          window.dispatchEvent(event);
        },
        (error) => {
          console.error('Chyba při získávání polohy:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  // Sledování polohy
  watchPosition(callback: (position: GeolocationPosition) => void, errorCallback?: (error: GeolocationPositionError) => void): number {
    // Přidáme posluchače do seznamu
    this.positionListeners.push(callback);

    // Pokud máme uloženou poslední polohu, okamžitě ji pošleme
    if (this.lastPosition) {
      setTimeout(() => callback(this.lastPosition!), 0);
    }

    // Pokud ještě nesledujeme polohu, začneme
    if (this.watchId === null) {
      this.startWatching(errorCallback);
    }

    // Vrátíme unikátní ID pro tento posluchač (index v poli)
    return this.positionListeners.length - 1;
  }

  // Ukončení sledování polohy pro konkrétního posluchače
  clearWatch(watchId: number): void {
    // Odstraníme posluchače ze seznamu
    if (watchId >= 0 && watchId < this.positionListeners.length) {
      this.positionListeners[watchId] = () => {}; // Nahradíme prázdnou funkcí
    }

    // Pokud nemáme žádné aktivní posluchače, ukončíme sledování
    const emptyFn = () => {};
    const allEmpty = this.positionListeners.every(listener => {
      // Porovnáme pouze, zda je funkce prázdná (nemůžeme porovnávat reference)
      return listener.toString().length === emptyFn.toString().length;
    });

    if (allEmpty) {
      this.stopWatching();
    }
  }

  // Získání poslední známé polohy
  getLastPosition(): GeolocationPosition | null {
    return this.lastPosition;
  }

  // Převod GeolocationPosition na objekt s lat, lng
  positionToLatLng(position: GeolocationPosition): { lat: number, lng: number } {
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
  }

  // Převod GeolocationPosition na objekt lokace pro plán
  positionToLocation(position: GeolocationPosition, name: string = 'Moje poloha'): any {
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      name: name,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp
    };
  }

  // Interní metoda pro zahájení sledování polohy
  private startWatching(errorCallback?: (error: GeolocationPositionError) => void): void {
    if (!navigator.geolocation) {
      if (errorCallback) {
        errorCallback({
          code: 0,
          message: 'Geolokace není podporována vaším prohlížečem.',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3
        });
      }
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.lastPosition = position;

        // Informujeme všechny posluchače o nové poloze
        this.positionListeners.forEach(listener => {
          try {
            listener(position);
          } catch (error) {
            console.error('Chyba při volání posluchače polohy:', error);
          }
        });

        // Vyvoláme událost pro informování ostatních komponent
        const event = new CustomEvent('userLocationUpdated', {
          detail: {
            position: position,
            latLng: this.positionToLatLng(position),
            location: this.positionToLocation(position)
          }
        });
        window.dispatchEvent(event);
      },
      (error) => {
        console.error('Chyba při sledování polohy:', error);
        if (errorCallback) {
          errorCallback(error);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );
  }

  // Interní metoda pro ukončení sledování polohy
  private stopWatching(): void {
    if (this.watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }
}

// Vytvoření a export instance služby
const geolocationService = new GeolocationService();
export default geolocationService;
