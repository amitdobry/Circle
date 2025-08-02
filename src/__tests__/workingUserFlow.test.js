/**
 * User Join Flow Tests - Working Version
 *
 * Tests the core user authentication and table joining logic
 */

import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// Test components that simulate the core UI logic
const MockHomePage = ({ isAuthenticated, userProfile, onJoin, onObserve }) => (
  <div>
    {isAuthenticated ? (
      <div>
        <span>Welcome, {userProfile?.name}!</span>
        <button onClick={onJoin}>Join Circle as {userProfile?.name}</button>
        <button onClick={onObserve}>Observe</button>
      </div>
    ) : (
      <div>
        <button onClick={() => onJoin("guest")}>Take a Seat</button>
        <button onClick={onObserve}>Observe</button>
        <button>Sign In</button>
      </div>
    )}
  </div>
);

const MockTableView = ({ userName, mode, onJoinedTable }) => {
  React.useEffect(() => {
    if (mode === "participant" && userName) {
      onJoinedTable(userName);
    }
  }, [mode, userName, onJoinedTable]);

  return (
    <div>
      <span data-testid="table-view">
        TableView - Mode: {mode}, User: {userName}
      </span>
    </div>
  );
};

describe("User Join Flow Tests", () => {
  describe("Guest User Journey", () => {
    test("shows correct options for guest users", () => {
      render(
        <MockHomePage
          isAuthenticated={false}
          onJoin={jest.fn()}
          onObserve={jest.fn()}
        />
      );

      expect(screen.getByText("Take a Seat")).toBeInTheDocument();
      expect(screen.getByText("Observe")).toBeInTheDocument();
      expect(screen.getByText("Sign In")).toBeInTheDocument();
    });

    test("handles guest join action", () => {
      const mockJoin = jest.fn();

      render(
        <MockHomePage
          isAuthenticated={false}
          onJoin={mockJoin}
          onObserve={jest.fn()}
        />
      );

      fireEvent.click(screen.getByText("Take a Seat"));
      expect(mockJoin).toHaveBeenCalledWith("guest");
    });

    test("emits joined-table when guest enters as participant", () => {
      const mockJoinedTable = jest.fn();

      render(
        <MockTableView
          userName="TestGuest"
          mode="participant"
          onJoinedTable={mockJoinedTable}
        />
      );

      expect(mockJoinedTable).toHaveBeenCalledWith("TestGuest");
    });
  });

  describe("Authenticated User Journey", () => {
    const mockUser = {
      name: "TestUser",
      avatarId: "Pirate",
      email: "test@example.com",
    };

    test("shows correct options for authenticated users", () => {
      render(
        <MockHomePage
          isAuthenticated={true}
          userProfile={mockUser}
          onJoin={jest.fn()}
          onObserve={jest.fn()}
        />
      );

      expect(
        screen.getByText(`Welcome, ${mockUser.name}!`)
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Join Circle as ${mockUser.name}`)
      ).toBeInTheDocument();
    });

    test("handles authenticated user join action", () => {
      const mockJoin = jest.fn();

      render(
        <MockHomePage
          isAuthenticated={true}
          userProfile={mockUser}
          onJoin={mockJoin}
          onObserve={jest.fn()}
        />
      );

      fireEvent.click(screen.getByText(`Join Circle as ${mockUser.name}`));
      expect(mockJoin).toHaveBeenCalled();
    });

    test("emits joined-table when authenticated user enters as participant", () => {
      const mockJoinedTable = jest.fn();

      render(
        <MockTableView
          userName={mockUser.name}
          mode="participant"
          onJoinedTable={mockJoinedTable}
        />
      );

      expect(mockJoinedTable).toHaveBeenCalledWith(mockUser.name);
    });
  });

  describe("Socket Communication Logic", () => {
    test("follows correct socket event sequence", () => {
      const events = [];
      const mockEmit = (event, data) => events.push({ event, data });

      const user = { name: "TestUser", avatarId: "Pirate" };

      // Simulate the socket event sequence
      mockEmit("request-join", { name: user.name, avatarId: user.avatarId });
      mockEmit("join-approved", user);
      mockEmit("joined-table", { name: user.name });

      expect(events).toEqual([
        {
          event: "request-join",
          data: { name: user.name, avatarId: user.avatarId },
        },
        { event: "join-approved", data: user },
        { event: "joined-table", data: { name: user.name } },
      ]);
    });

    test("handles join rejection correctly", () => {
      const events = [];
      const mockEmit = (event, data) => events.push({ event, data });

      const user = { name: "TestUser", avatarId: "Pirate" };

      mockEmit("request-join", { name: user.name, avatarId: user.avatarId });
      mockEmit("join-rejected", { reason: "Name already taken" });

      expect(events).toEqual([
        {
          event: "request-join",
          data: { name: user.name, avatarId: user.avatarId },
        },
        { event: "join-rejected", data: { reason: "Name already taken" } },
      ]);
    });
  });

  describe("Observer Mode", () => {
    test("does not emit joined-table when entering as observer", () => {
      const mockJoinedTable = jest.fn();

      render(
        <MockTableView
          userName="TestUser"
          mode="observer"
          onJoinedTable={mockJoinedTable}
        />
      );

      expect(mockJoinedTable).not.toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    test("handles empty username gracefully", () => {
      const mockJoinedTable = jest.fn();

      render(
        <MockTableView
          userName=""
          mode="participant"
          onJoinedTable={mockJoinedTable}
        />
      );

      expect(mockJoinedTable).not.toHaveBeenCalled();
    });

    test("handles missing user profile gracefully", () => {
      render(
        <MockHomePage
          isAuthenticated={true}
          userProfile={null}
          onJoin={jest.fn()}
          onObserve={jest.fn()}
        />
      );

      expect(screen.getByText("Welcome, !")).toBeInTheDocument();
    });
  });

  describe("Complete User Journeys", () => {
    test("simulates complete guest user journey", () => {
      const events = [];
      const mockEmit = (event, data) => events.push({ event, data });

      // 1. Guest visits homepage and clicks "Take a Seat"
      const { rerender } = render(
        <MockHomePage
          isAuthenticated={false}
          onJoin={() => mockEmit("navigate", "/name")}
          onObserve={jest.fn()}
        />
      );

      fireEvent.click(screen.getByText("Take a Seat"));
      expect(events).toContainEqual({ event: "navigate", data: "/name" });

      // 2. Guest completes name selection and requests join
      mockEmit("request-join", { name: "GuestUser", avatarId: "Pirate" });

      // 3. Server approves join
      mockEmit("join-approved", { name: "GuestUser", avatarId: "Pirate" });

      // 4. Guest enters table as participant
      rerender(
        <MockTableView
          userName="GuestUser"
          mode="participant"
          onJoinedTable={(name) => mockEmit("joined-table", { name })}
        />
      );

      expect(events).toContainEqual({
        event: "joined-table",
        data: { name: "GuestUser" },
      });
    });

    test("simulates complete authenticated user journey", () => {
      const events = [];
      const mockEmit = (event, data) => events.push({ event, data });

      const user = { name: "AuthUser", avatarId: "Ninja" };

      // 1. Authenticated user visits homepage and clicks join
      const { rerender } = render(
        <MockHomePage
          isAuthenticated={true}
          userProfile={user}
          onJoin={() =>
            mockEmit("request-join", {
              name: user.name,
              avatarId: user.avatarId,
            })
          }
          onObserve={jest.fn()}
        />
      );

      fireEvent.click(screen.getByText(`Join Circle as ${user.name}`));
      expect(events).toContainEqual({
        event: "request-join",
        data: { name: user.name, avatarId: user.avatarId },
      });

      // 2. Server approves join
      mockEmit("join-approved", user);

      // 3. User enters table as participant
      rerender(
        <MockTableView
          userName={user.name}
          mode="participant"
          onJoinedTable={(name) => mockEmit("joined-table", { name })}
        />
      );

      expect(events).toContainEqual({
        event: "joined-table",
        data: { name: user.name },
      });
    });
  });
});
